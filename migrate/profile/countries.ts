import { Nationality as CountryCode } from "../../contract-types/data-contracts"

export type CountryConfiguration = {
  name: string,
  contracts: {
    contract: number,
    permanent: number
  },
  cities: {
    [city: string]: [min: number, max: number]
  },
  flags: {
    contractorsHaveBenefits: boolean
  }
}

export const countries: {
  [countryCode in CountryCode]: CountryConfiguration
} = {
  "US": {
    "name": "United States of America",
    "contracts": {
      "contract": 70,
      "permanent": 30
    },
    "cities": {
      "San Francisco": [20, 30],
      "Milpitas": [30, 40],
      "Dallas": [120, 220],
      "Boston": [80, 150]
    },
    "flags": {
      "contractorsHaveBenefits": false
    }
  },
  "UK": {
    "name": "United Kingdom",
    "contracts": {
      "contract": 20,
      "permanent": 80
    },
    "cities": {
      "London": [20, 40],
      "Manchester": [40, 70],
      "Bracknell": [50, 80],
      "Reading": [20, 30],
      "Plymouth": [20, 30]
    },
    "flags": {
      "contractorsHaveBenefits": false
    }
  },
  "DE": {
    "name": "Germany",
    "contracts": {
      "contract": 5,
      "permanent": 95
    },
    "cities": {
      "München": [50, 120],
      "Frankfurt am Main": [30, 60],
      "Dresden": [40, 60],
      "Darmstadt": [10, 120]
    },
    "flags": {
      "contractorsHaveBenefits": true
    }
  },
  "FR": {
    "name": "France",
    "contracts": {
      "contract": 10,
      "permanent": 90
    },
    "cities": {
      "Lille": [20, 40],
      "Rennes": [20, 30],
      "Brest": [30, 60],
      "Paris": [40, 120]
    },
    "flags": {
      "contractorsHaveBenefits": true
    }
  },
  "NL": {
    "name": "Netherlands",
    "contracts": {
      "contract": 20,
      "permanent": 80
    },
    "cities": {
      "Amsterdam": [20, 60],
      "Den Haag": [30, 40],
      "Utrecht": [30, 80]
    },
    "flags": {
      "contractorsHaveBenefits": true
    }
  },
  "PL": {
    "name": "Poland",
    "contracts": {
      "contract": 60,
      "permanent": 40
    },
    "cities": {
      "Warszawa": [60, 80],
      "Wrocław": [60, 80],
      "Gdańsk": [70, 90],
      "Radom": [20, 40],
      "Szczecin": [40, 70],
      "Kraków": [30, 70],
      "Lublin": [80, 120],
      "Łódź": [150, 230]
    },
    "flags": {
      "contractorsHaveBenefits": false
    }
  },
  "IT": {
    "name": "Italy",
    "contracts": {
      "contract": 25,
      "permanent": 75
    },
    "cities": {
      "Roma": [30, 50],
      "Torino": [20, 80]
    },
    "flags": {
      "contractorsHaveBenefits": false
    }
  },
  "ES": {
    "name": "Spain",
    "contracts": {
      "contract": 25,
      "permanent": 75
    },
    "cities": {
      "Granada": [10, 30],
      "Valencia": [10, 40],
      "Getafe": [20, 30],
      "Madrid": [10, 30]
    },
    "flags": {
      "contractorsHaveBenefits": false
    }
  },
  "IN": {
    "name": "India",
    "contracts": {
      "contract": 100,
      "permanent": 0
    },
    "cities": {
      "Mumbai": [200, 300],
      "Delhi": [100, 200],
      "Bangalore": [100, 200],
      "Hyderabad": [100, 200]
    },
    "flags": {
      "contractorsHaveBenefits": false
    }
  },
}
