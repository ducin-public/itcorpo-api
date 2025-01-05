import { probability } from './lib/math'
import { benefits, countries } from '../../config'

// import { Employee, Nationality, BenefitServiceType } from '../../typings'
import { getCity, getCountry } from './basic';
import { Nationality } from '../typedef/data-contracts';
import { BenefitServiceType } from '../typedef-old';

type NationalityToServiceListMap = {
  [nationality in Nationality]: BenefitServiceType[]
}
const countryToServiceMap = Object.entries(benefits)
  .reduce((aggr, [service, { availability, monthlyCost }]) => {
    availability.forEach(countryCode => {
      if (!aggr[countryCode]) {
        aggr[countryCode] = []
      }
      aggr[countryCode].push(service as BenefitServiceType)
    })
    return aggr
  }, {} as NationalityToServiceListMap);

type NationalityToBooleanMap = {
  [nationality in Nationality]: boolean
}
const countryCanHaveBenefits = Object.entries(countries)
  .reduce((aggr, [countryCode, { flags: { contractorsHaveBenefits }}]) => {
    aggr[countryCode] = contractorsHaveBenefits
    return aggr
  }, {} as NationalityToBooleanMap)

const canHaveBenefits = (e: Employee) => e.contractType === 'permanent' || countryCanHaveBenefits[e.nationality]

export function* employeeBenefitsGenerator(employees: Employee[]){
  for (let e of employees){
    for (let service of countryToServiceMap[e.nationality]){
      if (probability(0.25) && canHaveBenefits(e)){
        yield {
          beneficiary: {
            name: `${e.firstName} ${e.lastName}`,
            email: e.email
          },
          city: getCity(e),
          country: getCountry(e),
          service,
          monthlyFee: benefits[service].monthlyCost
        }
      }
    }
  }
}
