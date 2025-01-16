import { BenefitService, Money, Nationality } from '../contract-types/data-contracts'

// # Healthcare
// - "LUXMED_GOLD_FAMILY"           # Full family coverage + dental
// - "LUXMED_SILVER_INDIVIDUAL"     # Individual coverage
// - "MEDICOVER_INTERNATIONAL"      # EU-wide coverage
// - "MEDICOVER_LOCAL_PLUS"         # Local + specialists
// - "ALLIANZ_GLOBAL_CARE"         # Worldwide coverage

// # Sport & Wellness
// - "MULTISPORT_ACTIVE_PLUS"      # All facilities + trainer
// - "MULTISPORT_WEEKEND"          # Weekend-only access
// - "FITPROFIT_UNLIMITED"         # All sports facilities
// - "YES2MOVE_ONLINE_FITNESS"     # Digital platform access
// - "CALYPSO_AQUA_WELLNESS"       # Swimming & spa access

// # Lunch & Food
// - "SODEXO_RESTAURANT_CHOICE"    # Restaurant network
// - "EDENRED_LUNCH_PASS"         # Local eateries network
// - "UP_LUNCH_EVERYWHERE"        # International coverage
// - "BONAPPETIT_LOCAL_BISTRO"    # Local restaurants only

// # Culture & Recreation
// - "BENEFIT_CULTURE_PLUS"       # Cinema, theatre, museums
// - "TICKETMASTER_EVENTS"        # Concerts & shows access
// - "EMPIK_GO_UNLIMITED"         # Books & audiobooks
// - "MYBENEFIT_FLEXIBLE_POINTS"  # Points for any activity

export const benefitServices: BenefitService[] = [
    {
        code: "LUXMED_GOLD_FAMILY",
        name: "LuxMed Gold Family Plan",
        category: "HEALTHCARE",
        provider: {
            name: "LuxMed",
            website: "https://luxmed.pl",
            contactEmail: "corporate@luxmed.pl",
            supportPhone: "+48 22 333 44 55",
            description: "Leading private healthcare provider in Poland with over 200 clinics nationwide"
        },
        description: "Premium family healthcare package with comprehensive coverage for the whole family",
        availableCountries: ["PL", "DE"],
        details: `Features:
- Unlimited GP and specialist consultations
- Home visits and teleconsultations 24/7
- Comprehensive dental care including orthodontics
- Advanced diagnostics and imaging
- Rehabilitation and physiotherapy
- International second opinion
- Premium hospitals network access

Limitations:
- 14 days waiting period for new subscribers
- Pre-existing conditions subject to evaluation
- Some experimental treatments excluded
- Annual check-up requirement`,
        cancellationPolicy: "60 days notice required for early termination"
    },
    {
        code: "MEDICOVER_INTERNATIONAL",
        name: "Medicover International Care",
        category: "HEALTHCARE",
        provider: {
            name: "Medicover",
            website: "https://medicover.com",
            contactEmail: "global@medicover.com",
            supportPhone: "+48 500 900 500",
            description: "International healthcare group providing high-quality services across Europe"
        },
        description: "Cross-border healthcare coverage for international employees",
        availableCountries: ["PL", "DE", "UK", "FR", "ES", "IT"],
        details: `Features:
- Access to Medicover facilities across Europe
- Direct billing in partner clinics
- 24/7 international assistance
- Repatriation coverage
- Translation services
- Global telemedicine platform
- Emergency dental care worldwide

Limitations:
- Standard treatments only in network facilities
- Emergency coverage worldwide
- Some treatments require pre-approval
- Annual limit on certain services`,
        cancellationPolicy: "90 days notice, minimum 12 months commitment"
    },
    {
        code: "MULTISPORT_ACTIVE_PLUS",
        name: "MultiSport Active Plus Card",
        category: "SPORT_WELLNESS",
        provider: {
            name: "Benefit Systems",
            website: "https://benefitsystems.pl",
            contactEmail: "corporate@benefitsystems.pl",
            supportPhone: "+48 22 242 42 42",
            description: "Market leader in employee sports benefits and wellness programs"
        },
        description: "Premium sports card providing access to top fitness facilities and activities",
        availableCountries: ["PL", "CZ", "BG", "SK"],
        details: `Features:
- Unlimited access to 4600+ sports facilities
- Premium fitness clubs included
- Swimming pools and aquaparks
- Squash and tennis courts
- Personal training sessions
- Workout classes
- Sauna and spa access

Limitations:
- One facility visit per day
- Some premium locations require surcharge
- Booking required for certain activities
- Non-transferable card`,
        cancellationPolicy: "Monthly renewal, cancel anytime with 30 days notice"
    },
    {
        code: "SODEXO_RESTAURANT_CHOICE",
        name: "Sodexo Restaurant Pass Premium",
        category: "LUNCH_FOOD",
        provider: {
            name: "Sodexo Benefits and Rewards",
            website: "https://sodexo.com",
            contactEmail: "benefits.pl@sodexo.com",
            supportPhone: "+48 22 535 11 11",
            description: "Global leader in quality of life services and employee benefit solutions"
        },
        description: "Digital meal card accepted at wide network of restaurants and food delivery services",
        availableCountries: ["PL", "FR", "DE", "ES", "IT"],
        details: `Features:
- Digital and physical card options
- Mobile app integration
- Real-time balance tracking
- Food delivery services included
- Wide restaurant network
- Tax-optimized solution
- Instant top-ups

Limitations:
- Alcohol purchases excluded
- Daily spending limit applies
- Only for food and non-alcoholic beverages
- Some locations may require minimum purchase`,
        cancellationPolicy: "Immediate cancellation possible, unused balance refundable"
    },
    {
        code: "EMPIK_GO_UNLIMITED",
        name: "Empik Go Unlimited Pass",
        category: "CULTURE_RECREATION",
        provider: {
            name: "Empik",
            website: "https://empik.com",
            contactEmail: "b2b@empik.com",
            supportPhone: "+48 22 462 72 50",
            description: "Poland's largest cultural goods and media retailer"
        },
        description: "Unlimited access to digital books, audiobooks, and podcasts",
        availableCountries: ["PL"],
        details: `Features:
- Unlimited audiobooks and ebooks
- Exclusive podcasts access
- Multi-device support
- Offline download option
- Family sharing up to 4 accounts
- New titles every week
- Personal recommendations

Limitations:
- Some new releases excluded
- Simultaneous usage restrictions
- Internet connection required for sync
- Some content region-locked`,
        cancellationPolicy: "30 days notice, annual subscription preferred"
    },
    {
        code: "LUXMED_SILVER_INDIVIDUAL",
        name: "LuxMed Silver Individual Plan",
        category: "HEALTHCARE",
        provider: {
            name: "LuxMed",
            website: "https://luxmed.pl",
            contactEmail: "corporate@luxmed.pl",
            supportPhone: "+48 22 333 44 55",
            description: "Leading private healthcare provider in Poland with over 200 clinics nationwide"
        },
        description: "Individual healthcare package with essential medical coverage",
        availableCountries: ["PL"],
        details: `Features:
- Access to general practitioners and specialists
- Basic diagnostic procedures
- Preventive healthcare programs
- Online consultation platform
- Medical hotline support

Limitations:
- Limited number of specialist visits per year
- Dental care not included
- Some specialized procedures require extra payment
- Referral required for certain specialists`,
        cancellationPolicy: "45 days notice required"
    },
    {
        code: "MEDICOVER_LOCAL_PLUS",
        name: "Medicover Local Plus",
        category: "HEALTHCARE",
        provider: {
            name: "Medicover",
            website: "https://medicover.com",
            contactEmail: "local@medicover.com",
            supportPhone: "+48 500 900 500",
            description: "International healthcare group providing high-quality services across Europe"
        },
        description: "Enhanced local healthcare coverage with additional specialist care",
        availableCountries: ["PL", "DE"],
        details: `Features:
- Access to local Medicover centers
- Extended specialist care
- Advanced diagnostics
- Preventive care programs
- Emergency medical assistance
- Dental check-ups

Limitations:
- Coverage limited to selected cities
- Some specialists require referral
- Annual health assessment mandatory
- Selected procedures need pre-approval`,
        cancellationPolicy: "60 days notice required"
    },
    {
        code: "ALLIANZ_GLOBAL_CARE",
        name: "Allianz Global Care Elite",
        category: "HEALTHCARE",
        provider: {
            name: "Allianz Care",
            website: "https://allianzcare.com",
            contactEmail: "corporate.care@allianz.com",
            supportPhone: "+49 89 3800 0",
            description: "Global insurance leader providing comprehensive healthcare solutions"
        },
        description: "Premium worldwide healthcare coverage for international professionals",
        availableCountries: ["DE", "FR", "UK", "ES", "IT", "PL", "NL", "US"],
        details: `Features:
- Worldwide medical coverage
- Private hospitals and clinics
- Emergency evacuation service
- Maternity and chronic condition care
- Mental health support
- Alternative medicine options
- Travel health insurance included

Limitations:
- US coverage limitations apply
- Pre-existing conditions evaluation
- Premium hospitals may require pre-approval
- Certain treatments need medical review`,
        cancellationPolicy: "90 days notice, annual contract required"
    },
    {
        code: "MULTISPORT_WEEKEND",
        name: "MultiSport Weekend Card",
        category: "SPORT_WELLNESS",
        provider: {
            name: "Benefit Systems",
            website: "https://benefitsystems.pl",
            contactEmail: "weekend@benefitsystems.pl",
            supportPhone: "+48 22 242 42 42",
            description: "Market leader in employee sports benefits and wellness programs"
        },
        description: "Weekend-only access to sports and recreational facilities",
        availableCountries: ["PL"],
        details: `Features:
- Access to facilities on weekends
- Swimming pools included
- Fitness classes
- Squash courts availability
- Sauna access
- Basic gym equipment

Limitations:
- Saturday and Sunday access only
- One entry per day
- Limited premium locations
- Standard facilities only`,
        cancellationPolicy: "30 days notice"
    },
    {
        code: "FITPROFIT_UNLIMITED",
        name: "FitProfit Unlimited Access",
        category: "SPORT_WELLNESS",
        provider: {
            name: "VanityStyle",
            website: "https://vanitystyle.pl",
            contactEmail: "fitprofit@vanitystyle.pl",
            supportPhone: "+48 22 371 50 72",
            description: "Leading provider of sports and recreation services in Poland"
        },
        description: "Unlimited access to fitness clubs and sports facilities nationwide",
        availableCountries: ["PL"],
        details: `Features:
- Full access to partner facilities
- No time restrictions
- Group fitness classes
- Swimming pools access
- Gym and fitness equipment
- Outdoor activities

Limitations:
- Partner network only
- Registration required
- Some classes need booking
- Peak hours may be busy`,
        cancellationPolicy: "45 days notice"
    },
    {
        code: "YES2MOVE_ONLINE_FITNESS",
        name: "Yes2Move Digital Fitness",
        category: "SPORT_WELLNESS",
        provider: {
            name: "Benefit Systems Digital",
            website: "https://yes2move.com",
            contactEmail: "support@yes2move.com",
            supportPhone: "+48 22 242 42 43",
            description: "Digital fitness platform offering online workouts and wellness content"
        },
        description: "Digital fitness platform with live and on-demand classes",
        availableCountries: ["PL", "DE", "CZ"],
        details: `Features:
- Live streaming classes
- On-demand workout library
- Personal training options
- Nutrition advice
- Progress tracking
- Mobile app access

Limitations:
- Internet connection required
- Some features need extra equipment
- Premium content additional cost
- Limited offline access`,
        cancellationPolicy: "Cancel anytime"
    },
    {
        code: "CALYPSO_AQUA_WELLNESS",
        name: "Calypso Aqua Wellness",
        category: "SPORT_WELLNESS",
        provider: {
            name: "Calypso Fitness",
            website: "https://calypso.com.pl",
            contactEmail: "aqua@calypso.pl",
            supportPhone: "+48 22 555 66 77",
            description: "Premium fitness and wellness club chain specializing in aqua activities"
        },
        description: "Comprehensive aqua fitness and wellness program",
        availableCountries: ["PL"],
        details: `Features:
- All swimming pools access
- Aqua fitness classes
- Wellness zone access
- Spa facilities
- Steam rooms and saunas
- Professional instructors

Limitations:
- Selected locations only
- Class booking required
- Time slot restrictions
- Seasonal maintenance closures`,
        cancellationPolicy: "60 days notice"
    },
    {
        code: "EDENRED_LUNCH_PASS",
        name: "Edenred Lunch Pass",
        category: "LUNCH_FOOD",
        provider: {
            name: "Edenred",
            website: "https://edenred.pl",
            contactEmail: "lunch@edenred.pl",
            supportPhone: "+48 22 534 77 77",
            description: "Global leader in payment solutions and employee benefits"
        },
        description: "Digital lunch card accepted at restaurants and food outlets",
        availableCountries: ["PL", "FR", "ES", "IT"],
        details: `Features:
- Wide restaurant network
- Digital payments
- Mobile app
- Balance tracking
- Special offers
- Tax benefits

Limitations:
- Lunch hours only
- Daily limit applies
- Selected merchants only
- No alcohol purchases`,
        cancellationPolicy: "30 days notice"
    },
    {
        code: "UP_LUNCH_EVERYWHERE",
        name: "Up Dejeuner Universal",
        category: "LUNCH_FOOD",
        provider: {
            name: "Up Group",
            website: "https://up.coop",
            contactEmail: "up@up-group.com",
            supportPhone: "+33 1 45 65 20 00",
            description: "International provider of employee benefits and social services"
        },
        description: "International lunch voucher system with wide acceptance",
        availableCountries: ["FR", "ES", "IT", "DE", "PL"],
        details: `Features:
- International acceptance
- Digital and physical cards
- Restaurant finder app
- Real-time transactions
- Cross-border usage
- Tax optimization

Limitations:
- Working days only
- Transaction limits apply
- Food and non-alcoholic only
- Country restrictions may apply`,
        cancellationPolicy: "45 days notice"
    },
    {
        code: "BONAPPETIT_LOCAL_BISTRO",
        name: "BonAppetit Local Dining",
        category: "LUNCH_FOOD",
        provider: {
            name: "BonAppetit Services",
            website: "https://bonappetit-services.eu",
            contactEmail: "dining@bonappetit.eu",
            supportPhone: "+49 30 225 225",
            description: "Local restaurant network focusing on authentic dining experiences"
        },
        description: "Access to curated local restaurants and bistros",
        availableCountries: ["DE", "AT", "CH"],
        details: `Features:
- Local restaurant network
- Authentic cuisine options
- Digital vouchers
- Special menu deals
- Lunch and dinner valid
- Weekend options

Limitations:
- Selected cities only
- Reservation may be needed
- Prix fixe menu only
- Partner restaurants only`,
        cancellationPolicy: "15 days notice"
    },
    {
        code: "BENEFIT_CULTURE_PLUS",
        name: "Benefit Culture Plus",
        category: "CULTURE_RECREATION",
        provider: {
            name: "Culture Benefits Group",
            website: "https://culture-benefits.eu",
            contactEmail: "culture@benefits.eu",
            supportPhone: "+49 30 987 654",
            description: "European cultural events and entertainment benefits provider"
        },
        description: "Access to cultural events and entertainment venues",
        availableCountries: ["DE", "FR", "PL", "ES"],
        details: `Features:
- Theater tickets
- Museum access
- Concert venues
- Art galleries
- Cultural workshops
- Festival discounts

Limitations:
- Subject to availability
- Booking required
- Selected venues only
- Some events excluded`,
        cancellationPolicy: "30 days notice"
    },
    {
        code: "TICKETMASTER_EVENTS",
        name: "Ticketmaster Corporate Access",
        category: "CULTURE_RECREATION",
        provider: {
            name: "Ticketmaster",
            website: "https://ticketmaster.com",
            contactEmail: "corporate@ticketmaster.com",
            supportPhone: "+1 800 653 8000",
            description: "World's leading ticket distribution and entertainment company"
        },
        description: "Priority access to concerts, shows, and sporting events",
        availableCountries: ["US", "UK", "DE", "FR", "ES", "IT", "PL", "NL"],
        details: `Features:
- Pre-sale access
- Priority booking
- VIP options
- Event notifications
- Mobile tickets
- Exclusive offers

Limitations:
- Limited ticket allocation
- Some events excluded
- Booking fees apply
- Country restrictions`,
        cancellationPolicy: "Non-cancellable, annual subscription"
    },
    {
        code: "MYBENEFIT_FLEXIBLE_POINTS",
        name: "MyBenefit Flex Points",
        category: "CULTURE_RECREATION",
        provider: {
            name: "MyBenefit",
            website: "https://mybenefit.pl",
            contactEmail: "flex@mybenefit.pl",
            supportPhone: "+48 71 777 77 77",
            description: "Comprehensive employee benefits platform with flexible points system"
        },
        description: "Flexible points system for various benefits and services",
        availableCountries: ["PL"],
        details: `Features:
- Flexible points allocation
- Wide service catalog
- Sports activities
- Cultural events
- Shopping vouchers
- Travel options
- Insurance products

Limitations:
- Points expire annually
- Selected partners only
- Some benefits seasonal
- Minimum points required`,
        cancellationPolicy: "Points valid for calendar year"
    }
]

export const nationalityToServiceAvailability = {
    PL: ["LUXMED_GOLD_FAMILY", "MEDICOVER_INTERNATIONAL", "MULTISPORT_ACTIVE_PLUS", "SODEXO_RESTAURANT_CHOICE", "EMPIK_GO_UNLIMITED", "LUXMED_SILVER_INDIVIDUAL", "MEDICOVER_LOCAL_PLUS", "ALLIANZ_GLOBAL_CARE", "MULTISPORT_WEEKEND", "FITPROFIT_UNLIMITED", "YES2MOVE_ONLINE_FITNESS", "CALYPSO_AQUA_WELLNESS", "EDENRED_LUNCH_PASS", "BONAPPETIT_LOCAL_BISTRO", "BENEFIT_CULTURE_PLUS", "MYBENEFIT_FLEXIBLE_POINTS"],
    DE: ["LUXMED_GOLD_FAMILY", "MEDICOVER_INTERNATIONAL", "MEDICOVER_LOCAL_PLUS", "ALLIANZ_GLOBAL_CARE", "UP_LUNCH_EVERYWHERE", "TICKETMASTER_EVENTS", "MYBENEFIT_FLEXIBLE_POINTS"],
    UK: ["MEDICOVER_INTERNATIONAL", "ALLIANZ_GLOBAL_CARE", "TICKETMASTER_EVENTS"],
    FR: ["MEDICOVER_INTERNATIONAL", "ALLIANZ_GLOBAL_CARE", "UP_LUNCH_EVERYWHERE", "TICKETMASTER_EVENTS", "BENEFIT_CULTURE_PLUS"],
    ES: ["MEDICOVER_INTERNATIONAL", "ALLIANZ_GLOBAL_CARE", "UP_LUNCH_EVERYWHERE", "TICKETMASTER_EVENTS", "BENEFIT_CULTURE_PLUS"],
    IT: ["MEDICOVER_INTERNATIONAL", "ALLIANZ_GLOBAL_CARE", "UP_LUNCH_EVERYWHERE", "TICKETMASTER_EVENTS", "BENEFIT_CULTURE_PLUS"],
    NL: ["MEDICOVER_INTERNATIONAL", "ALLIANZ_GLOBAL_CARE", "TICKETMASTER_EVENTS"],
    US: ["MEDICOVER_INTERNATIONAL", "ALLIANZ_GLOBAL_CARE", "TICKETMASTER_EVENTS"],
}

// Price ranges per service and country (in EUR)
export const PRICE_RANGES: Record<string, Record<Nationality, Money>> = {
    // Healthcare
    LUXMED_GOLD_FAMILY: { PL: 150, UK: 300, FR: 280, DE: 290, NL: 285, US: 400, IT: 270, ES: 260, IN: NaN },
    LUXMED_SILVER_INDIVIDUAL: { PL: 80, UK: 200, FR: 190, DE: 195, NL: 192, US: 250, IT: 185, ES: 180, IN: NaN },
    MEDICOVER_INTERNATIONAL: { PL: 200, UK: 350, FR: 340, DE: 345, NL: 342, US: 450, IT: 335, ES: 330, IN: NaN },
    MEDICOVER_LOCAL_PLUS: { PL: 100, UK: 220, FR: 210, DE: 215, NL: 212, US: 280, IT: 205, ES: 200, IN: NaN },
    ALLIANZ_GLOBAL_CARE: { PL: 300, UK: 500, FR: 490, DE: 495, NL: 492, US: 600, IT: 485, ES: 480, IN: NaN },

    // Sport & Wellness
    MULTISPORT_ACTIVE_PLUS: { PL: 50, UK: 90, FR: 85, DE: 88, NL: 87, US: 120, IT: 83, ES: 80, IN: NaN },
    MULTISPORT_WEEKEND: { PL: 30, UK: 60, FR: 58, DE: 59, NL: 58, US: 80, IT: 56, ES: 55, IN: NaN },
    FITPROFIT_UNLIMITED: { PL: 45, UK: 85, FR: 82, DE: 84, NL: 83, US: 110, IT: 80, ES: 78, IN: NaN },
    YES2MOVE_ONLINE_FITNESS: { PL: 20, UK: 40, FR: 38, DE: 39, NL: 38, US: 50, IT: 37, ES: 36, IN: NaN },
    CALYPSO_AQUA_WELLNESS: { PL: 40, UK: 75, FR: 72, DE: 74, NL: 73, US: 100, IT: 70, ES: 68, IN: NaN },

    // Lunch & Food
    SODEXO_RESTAURANT_CHOICE: { PL: 150, UK: 280, FR: 270, DE: 275, NL: 273, US: 350, IT: 265, ES: 260, IN: NaN },
    EDENRED_LUNCH_PASS: { PL: 140, UK: 260, FR: 250, DE: 255, NL: 253, US: 330, IT: 245, ES: 240, IN: NaN },
    UP_LUNCH_EVERYWHERE: { PL: 180, UK: 320, FR: 310, DE: 315, NL: 313, US: 400, IT: 305, ES: 300, IN: NaN },
    BONAPPETIT_LOCAL_BISTRO: { PL: 120, UK: 230, FR: 220, DE: 225, NL: 223, US: 290, IT: 215, ES: 210, IN: NaN },

    // Culture & Recreation
    BENEFIT_CULTURE_PLUS: { PL: 60, UK: 110, FR: 105, DE: 108, NL: 107, US: 140, IT: 103, ES: 100, IN: NaN },
    TICKETMASTER_EVENTS: { PL: 70, UK: 130, FR: 125, DE: 128, NL: 127, US: 160, IT: 123, ES: 120, IN: NaN },
    EMPIK_GO_UNLIMITED: { PL: 25, UK: 45, FR: 43, DE: 44, NL: 43, US: 60, IT: 42, ES: 40, IN: NaN },
    MYBENEFIT_FLEXIBLE_POINTS: { PL: 100, UK: 180, FR: 175, DE: 177, NL: 176, US: 230, IT: 172, ES: 170, IN: NaN }
}