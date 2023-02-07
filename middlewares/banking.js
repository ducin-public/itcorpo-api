const express = require('express')
const { v4: uuid } = require('uuid')

const { logError, logDebug } = require('../lib/util');
const { APIErrorDTO, ErrorCodes } = require('../lib/api-error');
const { validateFunctions } = require('../schema/validate');
const validateToken = validateFunctions.tokenConfirmRequest;
const validateLimits = validateFunctions.limitsChangeRequest;

const router = express.Router()

const tokenDB = {}

let tokenCount = 0
const generateToken = () => {
  const dateStr = (new Date()).toLocaleString()
  const tokenId = uuid()
  tokenCount++
  const instruction = `Wpisz kod SMS (wysłany ${dateStr})`
  const result = { tokenId, instruction }

  tokenDB[tokenId] = result

  return result
}

const inMemoryLimitsState = {
  dailyLimit: 500,
  availableDailyAmount: 500,
  monthlyLimit: 10000,
  availableMonthlyAmount: 9876.54,
  verificationMethod: 'SMS-CODE',
}

let pendingLimitsUpdate

const verifyToken = ({ tokenId, tokenCode }) => {
  return (tokenCode.length === 4)
}

router.post('/token/', (req, res) => {
  const token = generateToken();
  logDebug(`generated token ${token.tokenId}`);
  return res.status(200).send(token);
});

router.post('/token/:token', (req, res) => {
  const { token } = req.params;

  if (!(token in tokenDB)){
    logError(`Invalid token ${token}`);
    const errorDTO = APIErrorDTO("NOT_FOUND", "Broken link")
    return res.status(ErrorCodes.NOT_FOUND).send(errorDTO);
  }

  const { tokenId, tokenCode } = req.body;

  // validate 
  var valid = validateToken(req.body);
  if (!valid) {
    logError(JSON.stringify(validateToken.errors))
    return res.status(400).send(validateToken.errors)
  }

  if (pendingLimitsUpdate && pendingLimitsUpdate.token.tokenId == tokenId){ // change limits token 
    if (verifyToken({ tokenId, tokenCode })) {
      logDebug(`Token Authenticated for limits change ${JSON.stringify(pendingLimitsUpdate.change)}`);
      Object.assign(inMemoryLimitsState, pendingLimitsUpdate.change)
      logDebug(`new limits state: ${JSON.stringify(inMemoryLimitsState)}`);
      pendingLimitsUpdate = undefined // clear
      return res.sendStatus(200);
    } else {
      logError(`Invalid token ${tokenId}:${tokenCode}`);
      const errorDTO = APIErrorDTO("INVALID_TOKEN", "Invalid token")
      return res.status(ErrorCodes.INVALID_TOKEN).send(errorDTO);
    }
  } else if (verifyToken({ tokenId, tokenCode })) {
    logDebug(`Token Authenticated`);
    return res.sendStatus(200);
  } else {
    logError(`Invalid token ${tokenId}:${tokenCode}`);
    const errorDTO = APIErrorDTO("INVALID_TOKEN", "Invalid token")
    return res.status(ErrorCodes.INVALID_TOKEN).send(errorDTO);
  }
});

router.get('/limits', (req, res) => {
  return res.status(200).send(inMemoryLimitsState);
});

router.post('/limits', (req, res) => {

  // validate 
  var valid = validateLimits(req.body);
  if (!valid) {
    logError(JSON.stringify(validateLimits.errors))
    return res.status(400).send(validateLimits.errors)
  }

  const change = req.body;

  let patch
  if (change.dailyLimit){
    const previousOutcomes = inMemoryLimitsState.dailyLimit - inMemoryLimitsState.availableDailyAmount
    patch = {
      availableDailyAmount: change.dailyLimit - previousOutcomes
    }
  } else if (change.monthlyLimit){
    const previousOutcomes = inMemoryLimitsState.monthlyLimit - inMemoryLimitsState.availableMonthlyAmount
    patch = {
      availableMonthlyAmount: change.monthlyLimit - previousOutcomes
    }
  }

  const token = generateToken();
  pendingLimitsUpdate = { // to be verified & confirmed in POST/token
    token: token,
    change: { ...change, ...patch }
  };

  logDebug(`generated token ${token.tokenId} for ${JSON.stringify(change)}`);
  return res.status(200).send({
    token,
    settings: { ...inMemoryLimitsState, ...pendingLimitsUpdate.change }
  });
});

module.exports = router
