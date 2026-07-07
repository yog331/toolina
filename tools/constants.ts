export const PAY_LEVELS = Array.from({ length: 24 }, (_, i) => `L-${i + 1}`);

export const PROBATIONER_PAY_MAP: Record<string, number> = {
  'L-1': 12400,
  'L-2': 12600,
  'L-3': 12800,
  'L-4': 13500,
  'L-5': 14600,
  'L-6': 15100,
  'L-7': 15700,
  'L-8': 18500,
  'L-9': 20100,
  'L-10': 23700,
  'L-11': 26500,
  'L-12': 31100,
  'L-13': 31100, // Fallback as L-13 is not defined in Schedule IV
  'L-14': 39300,
  'L-15': 42500,
  'L-16': 47200,
  'L-17': 49700,
  'L-18': 52800,
  'L-19': 56000,
  'L-20': 62300,
  'L-21': 86200,
  'L-22': 90800,
  'L-23': 102100,
  'L-24': 104200
};

export const GRADE_PAY_MAP: Record<string, number> = {
  'L-1': 1700, 'L-2': 1750, 'L-3': 1900, 'L-4': 2000, 'L-5': 2400,
  'L-6': 2400, 'L-7': 2400, 'L-8': 2800, 'L-9': 2800, 'L-10': 3600,
  'L-11': 4200, 'L-12': 4800, 'L-13': 5400, 'L-14': 5400, 'L-15': 6000,
  'L-16': 6600, 'L-17': 6800, 'L-18': 7200, 'L-19': 7600, 'L-20': 8200,
  'L-21': 8700, 'L-22': 8900, 'L-23': 9500, 'L-24': 10000
};

export const PAY_MATRIX: Record<string, number[]> = {
  'L-1': [17700, 18200, 18700, 19300, 19900, 20500, 21100, 21700, 22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000, 51500, 53000, 54600, 56200],
  'L-2': [17900, 18400, 19000, 19600, 20200, 20800, 21400, 22000, 22700, 23400, 24100, 24800, 25500, 26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56800],
  'L-3': [18200, 18700, 19300, 19900, 20500, 21100, 21700, 22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000, 51500, 53000, 54600, 56200, 57900],
  'L-4': [19200, 19800, 20400, 21000, 21600, 22200, 22900, 23600, 24300, 25000, 25800, 26600, 27400, 28200, 29000, 29900, 30800, 31700, 32700, 33700, 34700, 35700, 36800, 37900, 39000, 40200, 41400, 42600, 43900, 45200, 46600, 48000, 49400, 50900, 52400, 54000, 55600, 57300, 59000, 60800],
  'L-5': [20800, 21400, 22000, 22700, 23400, 24100, 24800, 25500, 26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56800, 58500, 60300, 62100, 64000, 65900],
  'L-6': [21500, 22100, 22800, 23500, 24200, 24900, 25600, 26400, 27200, 28000, 28800, 29700, 30600, 31500, 32400, 33400, 34400, 35400, 36500, 37600, 38700, 39900, 41100, 42300, 43600, 44900, 46200, 47600, 49000, 50500, 52000, 53600, 55200, 56900, 58600, 60400, 62200, 64100, 66000, 68000],
  'L-7': [22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600, 41800, 43100, 44400, 45700, 47100, 48500, 50000, 51500, 53000, 54600, 56200, 57900, 59600, 61400, 63200, 65100, 67100, 69100, 71200],
  'L-8': [26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56800, 58500, 60300, 62100, 64000, 65900, 67900, 69900, 72000, 74200, 76400, 78700, 81100, 83500],
  'L-9': [28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56800, 58500, 60300, 62100, 64000, 65900, 67900, 69900, 72000, 74200, 76400, 78700, 81100, 83500, 86000, 88600, 91300],
  'L-10': [33800, 34800, 35800, 36900, 38000, 39100, 40300, 41500, 42700, 44000, 45300, 46700, 48100, 49500, 51000, 52500, 54100, 55700, 57400, 59100, 60900, 62700, 64600, 66500, 68500, 70600, 72700, 74900, 77100, 79400, 81800, 84300, 86800, 89400, 92100, 94900, 97700, 100600, 103600, 106700],
  'L-11': [37800, 38900, 40100, 41300, 42500, 43800, 45100, 46500, 47900, 49300, 50800, 52300, 53900, 55500, 57200, 58900, 60700, 62500, 64400, 66300, 68300, 70300, 72400, 74600, 76800, 79100, 81500, 83900, 86400, 89000, 91700, 94500, 97300, 100200, 103200, 106300, 109500, 112800, 116200, 119700],
  'L-12': [44300, 45600, 47000, 48400, 49900, 51400, 52900, 54500, 56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90000, 92700, 95500, 98400, 101400, 104400, 107500, 110700, 114000, 117400, 120900, 124500, 128200, 132000, 136000, 140100],
  'L-13': [53100, 54700, 56300, 58000, 59700, 61500, 63300, 65200, 67200, 69200, 71300, 73400, 75600, 77900, 80200, 82600, 85100, 87700, 90300, 93000, 95800, 98700, 101700, 104800, 107900, 111100, 114400, 117800, 121300, 124900, 128600, 132500, 136500, 140600, 144800, 149100, 153600, 158200, 162900, 167800],
  'L-14': [56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90000, 92700, 95500, 98400, 101400, 104400, 107500, 110700, 114000, 117400, 120900, 124500, 128200, 132000, 136000, 140100, 144300, 148600, 153100, 157700, 162400, 167300, 172300, 177500],
  'L-15': [60700, 62500, 64400, 66300, 68300, 70300, 72400, 74600, 76800, 79100, 81500, 83900, 86400, 89000, 91700, 94500, 97300, 100200, 103200, 106300, 109500, 112800, 116200, 119700, 123300, 127000, 130800, 134700, 138700, 142900, 147200, 151600, 156100, 160800, 165600, 170600, 175700, 181000, 186400, 192000],
  'L-16': [67300, 69300, 71400, 73500, 75700, 78000, 80300, 82700, 85200, 87800, 90400, 93100, 95900, 98800, 101800, 104900, 108000, 111200, 114500, 117900, 121400, 125000, 128800, 132700, 136700, 140800, 145000, 149400, 153900, 158500, 163300, 168200, 173200, 178400, 183800, 189300, 195000],
  'L-17': [71000, 73100, 75300, 77600, 79900, 82300, 84800, 87300, 89900, 92600, 95400, 98300, 101200, 104200, 107300, 110500, 113800, 117200, 120700, 124300, 128000, 131800, 135800, 139900, 144100, 148400, 152900, 157500, 162200, 167100, 172100, 177300, 182600, 188100, 193700, 199500],
  'L-18': [75300, 77600, 79900, 82300, 84800, 87300, 89900, 92600, 95400, 98300, 101200, 104200, 107300, 110500, 113800, 117200, 120700, 124300, 128000, 131800, 135800, 139900, 144100, 148400, 152900, 157500, 162200, 167100, 172100, 177300, 182600, 188100, 193700, 199500],
  'L-19': [79900, 82300, 84800, 87300, 89900, 92600, 95400, 98300, 101200, 104200, 107300, 110500, 113800, 117200, 120700, 124300, 128000, 131800, 135800, 139900, 144100, 148400, 152900, 157500, 162200, 167100, 172100, 177300, 182600, 188100, 193700, 199500],
  'L-20': [88900, 91600, 94300, 97100, 100000, 103000, 106100, 109300, 112600, 116000, 119500, 123100, 126800, 130600, 134500, 138500, 142700, 147000, 151400, 155900, 160600, 165400, 170400, 175500, 180800, 186200, 191800, 197600, 203500],
  'L-21': [123100, 126800, 130600, 134500, 138500, 142700, 147000, 151400, 155900, 160600, 165400, 170400, 175500, 180800, 186200, 191800, 197600, 203500],
  'L-22': [129700, 133600, 137600, 141700, 146000, 150400, 154900, 159500, 164300, 169200, 174300, 179500, 184900, 190400, 196100, 202000, 208100],
  'L-23': [145800, 150200, 154700, 159300, 164100, 169000, 174100, 179300, 184700, 190200, 195900, 201800, 207900, 214100],
  'L-24': [148800, 153300, 157900, 167500, 172500, 177700, 183000, 188500, 194200, 200000, 206000, 212200, 218600]
};

export const MESS_RATE_PRESETS = [
  { label: 'Nursing', rate: 1450 },
  { label: 'Police/Jail', rate: 2700 },
  { label: 'Standard', rate: 450 },
  { label: 'None', rate: 0 }
];

export const HARD_DUTY_PRESETS = [
  { label: 'Nursing/Medical', rate: 250 },
  { label: 'Police/SDRF', rate: 500 },
  { label: 'High Alert Duty', rate: 1000 },
  { label: 'None', rate: 0 }
];

export interface Post {
  title: string;
  level: string;
  gradePay: number;
  initialPay: number;
  messRate?: number;
  hardDutyRate?: number;
  ruralRate?: number;
}

export interface Department {
  name: string;
  posts: Post[];
}

export const DEPARTMENT_DATA: Department[] = [
    {
        "name": "RAJASTHAN ACCOUNTS AND SUBORDINATE ACCOUNTS SERVICE",
        "posts": [
            {
                "title": "Ordinary Scale",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Scale",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Selection Scale",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Supertime Scale",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Higher Supertime Scale",
                "level": "L-23",
                "gradePay": 9500,
                "initialPay": 145800
            },
            {
                "title": "Junior Accountant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Accounts Officer Grade-II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Accounts Officer Grade-I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "RAJASTHAN ADMINISTRATIVE SERVICE",
        "posts": [
            {
                "title": "Ordinary Scale",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Scale",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Selection Scale",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Supertime Scale",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Higher Supertime Scale",
                "level": "L-23",
                "gradePay": 9500,
                "initialPay": 145800
            }
        ]
    },
    {
        "name": "AGRICULTURE DEPARTMENT",
        "posts": [
            {
                "title": "Additional Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Chief Statistical Officer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Joint Director (Extension)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Agriculture Engineer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Project Director (Extension)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Principal, Agriculture Training Centre",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Senior Plant Pathologist",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Director Information",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Agriculture Information Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Assistant Director",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "District Extension Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Assistant Director (Quality Control)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Exhibition Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "District Agricultural Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Cotton Extension Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Producer (Video)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director (Statistics)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Statistical Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Asstt. Director (Statistics)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director (Quality Control)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Executive Engineer (Agriculture Engineering)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Engineer (Agriculture)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Agriculture Supervisor",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Village Extension Worker",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Assistant Agriculture Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Machine man (Duplicating)",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Demonstrator",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Offset Printer",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Proof Reader",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Agriculture Information Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Journalist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Technician Audio Video Production",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Technician Video",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Press Manager",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Graphic Artist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Dark Room Asstt.",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Artist",
                "level": "L-9",
                "gradePay": 2800,
                "initialPay": 28700
            },
            {
                "title": "Photographer & Photographer-Cum-Artist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Compositor-cum-Printer",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Offset Press Operator & Press Operator",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Printer Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Investigator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Statistical Officer (Agriculture)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Junior Scientific Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Agriculture Research Officer (Botany)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Agriculture Research Officer (Agriculture Chemistry)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Agriculture Research Officer (Plant Pathology)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Agriculture Research Officer (Entomology)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Agriculture Research Officer (Agronomy)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Agriculture Research Officer (Horticulture)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Agriculture Research Officer (Agricultural Economics)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Junior Engineer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Foreman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Work-Shop Superintendent",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "AGRICULTURE MARKETING DEPARTMENT",
        "posts": [
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Computer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Chemist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Marketing Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Chemist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Marketing Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            }
        ]
    },
    {
        "name": "ANIMAL HUSBANDRY DEPARTMENT",
        "posts": [
            {
                "title": "Veterinary Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Fisheries Development Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Fisheries Project Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Rinderpest Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Project Officer I.P.D.B.",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Feed and Fodder Development Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Veterinary Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Assistant Director",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Assistant Director & Principal Training School / Survey & Investigation Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Director Fisheries",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Officer-in-Charge Animal Genetics",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Director",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Syce / Cattle Attendant / Bull Attendant / Camel Attendant / Shepherds",
                "level": "L-1",
                "gradePay": 1700,
                "initialPay": 17700
            },
            {
                "title": "Agriculture Assistant (Non-Agricultural Graduates)",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Livestock Assistant / Enumerator / Milk Recorder",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Junior Livestock Inspector / Poultry Supervisor / Fodder Supervisor",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Poultry Manager",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Veterinary Assistant / Senior Livestock Inspector / Assistant Superintendent (CBF) / Laboratory Technician",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Fodder Demonstrator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant information Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Agriculture Assistant (Agriculture Graduates)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Veterinary Assistant (For two years emergency Diploma Holders)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Information Officer (Technical)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Lineman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Technician (Radiology)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Auto Clave Operator",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Artist-Cum-Photographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Artist Grade-I",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Planning Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Overseer / Junior Engineer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Fish Fieldman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Fish Lab Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Fisheries Inspector",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Lecturer, Fisheries Training School",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Fisheries Extension Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Fisheries Research Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Asstt. Fisheries Development Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Dark Room Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Field Assistant (B.P. Lab)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Technician",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Plant Operator (Electrical / Mechanical)",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "X-Ray Technician",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Librarian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Radiographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Animal Husbandry Extension Officer (Exhibition)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Demonstrator, Animal Husbandry School",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Field Extension Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Surra Control Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Agromomist Cattle Breeding Farm, Dug",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Training Officer (A.I.) Lecturer, Animal Husbandry School",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Project Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Officer-In-Charge Poultry Diagnostic & Feed Analysis",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Sire Evaluation Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Principal, Animal Husbandry School",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Research Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Research Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Surra Investigation Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Piggery Development Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Disease Investigation Officer (Veterinary and Poultry)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Superintendent, Cattle Breeding Farm / Poultry Farm",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "District Animal Husbandry Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Assistant Virologist",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Officer-in-charge Laboratory Animals",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Assistant Bacteriologist",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Junior Epidemiologist",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Goat Development Officer (Veterinarian)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Animal Pathologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Animal Nutritionist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Bacteriologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Virologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Epidemiologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Project Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Project Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            }
        ]
    },
    {
        "name": "ARBI AND PHARSI RESEARCH INSTITUTE",
        "posts": [
            {
                "title": "Manuscripts Attendant",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Mender-cum-Binder",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Copyist",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Preservation Asstt",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Calligraphist",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Junior Technical Assistant",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Translator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Surveyor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Research Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Cataloguer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Micro Photographist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Research Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            }
        ]
    },
    {
        "name": "ARCHAEOLOGICAL & MUSEUM DEPARTMENT",
        "posts": [
            {
                "title": "Numismatist",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Curator",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Exploration & Excavation Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Superintendent Technical",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Superintendent",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Excavation Superintendent",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Pottery Assistant",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Mender-cum-Binder",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Photographer-cum-Dark Room Assistant",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Supervisor (Forts & Palaces)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Modeller",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Assistant Librarian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Custodian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Preservation Asstt.",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Monument Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Photographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Overseer (J.En.)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Reference Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Senior Monument Inspector",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Superintendent for Architectural Survey",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Superintendent for Arts Survey",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Chief Archaeological Chemist",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Superintendent Jyotish Yantralaya",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            }
        ]
    },
    {
        "name": "ARCHIVES DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Junior Technical Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Senior Technical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Research Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Research Scholar",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Archivist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Research Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Archivist",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Chemist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Chemist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Scientific Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Binder",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Book Binder",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Preservation Assistant (LDC)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Decipherist (LDC)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Laboratory Asstt.",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Investigator (UDC)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Record Assistant (UDC)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            }
        ]
    },
    {
        "name": "AYURVED DEPARTMENT",
        "posts": [
            {
                "title": "Ayurved Medical Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director (Ayurved) / Sr. Ayurved Medical Officer Grade-II (Inter-Changeable)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director (Ayurved) / Sr. Ayurved Medical Officer Grade-I / Incharge, Pharmacy (Inter-Changeable)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional Director (Ayurved) / Pradhan Ayurved Medical Officer / Manager Pharmacy (Inter-Changeable)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Director (Ayurved)",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Lecturer / Asstt. Physician",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Professor / Physician Specialist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Professor (P.G.)",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Vice Principal",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Principal",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Homeopathy Medical Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director (Homeopathy) / Sr. Homeopathy Medical Officer Grade- II (Inter-Changeable)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director (Homeopathy) / Sr. Homeopathy Medical Officer Grade- I (Inter-Changeable)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional Director Homeopathy) / Pradhan Homeopathy Medical Officer (Inter-Changeable)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Director ( Homeopathy )",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Unani Medical Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director (Unani) / Sr. Unani Medical Officer Grade- II (Inter-Changeable)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director (Unani) / Sr. Unani Medical Officer Grade-I (Inter-Changeable)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional Director (Unani) / Pradhan Unani Medical Officer (Inter-Changeable)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Director ( Unani )",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Lecturer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Principal",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Medicine Manufacturing Machine Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Exhibition Asstt.",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Senior Medicine Manufacturing Operator",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Laboratory Asstt.",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Laboratory Technician",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Jr Compounder / Nurse",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Artist-cum-Photographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior compounder / Nurse",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Physical Training Instructor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Junior Ayurved / Unani Chikitsak",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Junior Homoeopathic Chikitsak",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Nursing Superintendent Grade-II",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Nursing Superintendent Grade-I",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Head Mate",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Attendant",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Packer",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Machineman (Duplicating)",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "ANM",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Botany Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Technical Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Assistant Radiographer",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Junior Analytical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sahayak Yoga Chikitsak",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Vanaspati Vistar Adhikari",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Distt Ayurved Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Demonstrator",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Drug Inspector",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Manager",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Medical Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Pathologist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Yoga Chikitsa Adhikari",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Officer-in-Charge Pharmacy",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Manager Pharmacies",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            }
        ]
    },
    {
        "name": "CIRCUIT HOUSES",
        "posts": [
            {
                "title": "House Keeper",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Senior House Keeper",
                "level": "L-9",
                "gradePay": 2800,
                "initialPay": 28700
            },
            {
                "title": "Manager Grade -II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Manager Grade -I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Dy. General Manager",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "General Manager",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Head Waiter",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Indian Cook",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18500
            },
            {
                "title": "English Cook Grade -II",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18500
            },
            {
                "title": "English Cook Grade -I / English Cook-cum-Butler",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            }
        ]
    },
    {
        "name": "COLONISATION DEPARTMENT",
        "posts": [
            {
                "title": "Patwari",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Assistant Office Kanoongo",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Junior Draftsman / Draftsman",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Head Draftsman / Draftsman",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Librarian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Land Record Inspector / Office Kanoongo",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sadar Munsarim",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Artist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Draftsman",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Head Draftsman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "COMMAND AREA DEVELOPMENT DEPARTMENT",
        "posts": [
            {
                "title": "Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "COMMERCIAL TAXES DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Commercial Taxes Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Commercial Taxes Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Commercial Taxes Officer (Senior Scale)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Dy. Commissioner Commercial Taxes (Selection Scale)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Commissioner",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Tax Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Junior Commercial Taxes Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Guard",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Sepoy (Flying Squad)",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18500
            },
            {
                "title": "Jamadar (Flying Squad)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Munim",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Artist",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "CO-OPERATIVE DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Registrar",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Deputy Registrar",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Joint Registrar",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71800
            },
            {
                "title": "Additional Registrar",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Registrar (Senior Scale)",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Inspector Grade- II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Inspector Grade- I",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Telephone Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Artist",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Photographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Publicity Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Planning Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Publicity Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "COURTS",
        "posts": [
            {
                "title": "Cook",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Book Binder",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Generator Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Motor Mechanic-cum-Driver",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Telex Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "E. P.A.B.X. Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Library Restorer",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Reference Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Lift Man",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Lower Division Clerk / Enquiry Clerk / House Keeper / Record weeder",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Data Entry Operator",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Cataloguer-cum-Classifier",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Computer Informer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Care Taker",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Jr. Accountant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Stamp Reporter / Court Fee Examiner",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Accountant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "P.A.- cum-Judgement writer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Translator, ordinary / Senior Scale",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Court Master",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Guest House Manager Grade-I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Sr. P. A-Cum-Judgement Writer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Accounts Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Chief Accountant-cum-Superintendent",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Superintendent",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Senior Librarian",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Registrar / Court Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Private Secretary-Cum-Judgement Writer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Dy Registrar Administration / Records / Protocol (Non RJS)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Senior Deputy Registrar",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Process Server",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Reader Grade-III (In the Court of Judicial Magistrates, Additional Chief Magistrates, Munsif & Judicial Magistrates Courts)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Reader Grade-II (Court of Civil Judges (Senior Division) / Chief Judicial Magistrate)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Reader Grade-I (In the Court of District Court / Additional District Judge Court)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Executive Assistant (In the Court of Principal District and Sessions Judge)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Senior Munsarim",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Protocol Officer-Cum-Administrative Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Stenographer Grade-III for the Courts of Civil Judge & Additional Civil Judges",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Stenographer Grade-II for the Courts of Senior Civil Judge & Additional Senior Civil Judges",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Stenographer Grade-I for the Courts of District & Sessions Judge & Additional District & Sessions Judges",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "DEVASTHAN DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Commissioner",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Deputy Commissioner",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Joint Commissioner",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Pujari",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Manager Grade -II",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18500
            },
            {
                "title": "Manager Grade -I",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Inspector Grade -II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Inspector Grade -I",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "ECONOMICS AND STATISTICAL DEPARTMENT",
        "posts": [
            {
                "title": "Statistical Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Computer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Statistical inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Statistical Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Librarian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            }
        ]
    },
    {
        "name": "EDUCATION DEPARTMENT",
        "posts": [
            {
                "title": "Basic Computer Instructor",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Senior Computer Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian Degree College",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Physical Training Instructor Degree College",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Gas Man",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Artist",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Section Cutter",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Tabla Player",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Matron",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Workshop Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Museum Keeper",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Taxi Dermist",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Dairy Supervisor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Farm Supervisor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Sr. Laboratory Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Cartographer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Librarian, Post Graduate College",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Physical Training Instructor, Post Graduate College",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Head Master, Head Mistress Secondary School (Boys & Girls)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Vice Principal, Senior Secondary School",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Head Mistress of Children School",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy District Education Officer (Boys & Girls)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "PA to Director of Education (if taken from teaching side)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Head Master, Deaf, Dumb & Blind School",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer in Music, School Education",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Lecturer in Music, in Teachers Training College/BSTC/RSTC School",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Lecturer in Drawing, School Education",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Drawing Instructor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Exhibition Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Lecturer in Humanities / Commerce / Science groups School Education",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "School Counsellor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Education Extension Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Sub Deputy District Education Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Director State Institute of Education / Correspondence Course",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Dy. Inspector of Schools in Directorate",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Research Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Craft Instructor Teachers Training College",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Head Master, Higher Secondary School of Boys",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Senior Deputy District Education Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Principal, Higher Secondary School / B.S.T.C. / R.T.C. (Boys)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional District Education Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "District Education Officer",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Deputy Director of Education (Range)",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Principal, Sardul Public School",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Joint Director of Education (Range)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Director of Education",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Head Mistress, Higher Secondary School for Girls",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Principal, Higher Secondary School / B.S.T.C. / R.T.C. (Girls)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "District Education Officer (Girls)",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Deputy Director of Education (Women) Range",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director of Education (Elementary) Directorate",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Joint Director of Education (Women)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Audio Visual Education Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Editor for Departmental Publication",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Psychologist",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Senior Deputy District Education Officer in Directorate",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Project Organiser",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Coordinator, Teachers Training College",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Research Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Technical Lecturer / Lecturer (State Institute of Educational Research and Training)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer, Teachers Training College",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Manager, Guru Nanak Sansthan",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Manager, Ravindra Rang Manch",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "State Librarian",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director of Education",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Evaluation Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Project Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Vice Principal, Sardul Public School, Bikaner",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Principal, Correspondence Course S.I.E.",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Senior Lecturer, Teachers Training College",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Senior Editor Departmental Publication",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director (Junior)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Vice Principal, Teachers Training College / Degree College",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Professor, Degree College / Post Graduate Teachers Training College",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Director (Senior) State Institute of Education",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director, Social Education",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director, Correspondence Course, S.I.E.",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director, Elementary Education",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director of Education (Adm.)",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director, State Bureau of Educational Vocational Guidance",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Principal, Teachers Training College / Degree College",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director, State Institute of Science Education",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Deputy Director of Education (Nutrition)",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Vice Principal (P.G.) T.T. College",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Joint Director of Education (H.Q.)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Principal, Post Graduate Teachers Training College",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Director of Education",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Director, Adult Education",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Director, S.I.E.R.T",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Sr. Lady Lecturer, College of Physical Education",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Sr. Lecturer, College of Physical Education",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Dy. District Education Officer, Physical Education",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "District Education Officer, Physical Education",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Vice Principal, College of Physical Education",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Principal, College of Physical Education",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Physical Training Instructor in Teachers Training College",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Supervisor, Physical Education",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Coaches, Physical",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Lecturer in College of Physical Education",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Lecturer, (Instrumental Music Sangeet Sansthan, Jaipur)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer, Drawing & Painting, Maharaja's School of Arts, Jaipur",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer, (Sculpture & Modelling)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer, (Commercial Arts) Maharaja's School of Arts, Jaipur",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Head of Music Department, Sangeet Sansthan, Jaipur",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Senior Lecturer State Institute of Science Education",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Principal, Sangeet Sansthan, Jaipur",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Principal, Maharaja's School of Arts, Jaipur",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "District Librarian (Junior)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Tehsil Block Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian in High School / S.T.C / Children School",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Cataloguer cum-Classifier (Libraries)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Librarian in Divisional Library",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Reference Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Divisional Librarian, Grade-II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Librarian in Divisional Library",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Librarian in Senior Secondary School / State Institute of Education / College of Physical Education & Teachers Training College",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "District Librarians (Senior)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Film Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Divisional Librarian Grade-I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Librarian, State Institute of Education",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Librarian, State Institute of Science Education",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Physical Training Instructor Grade-III",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Physical Training Instructor Grade-II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Junior Lecturer in College of Physical Education",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Physical Training Instructor, in Teachers Training College / BSTC Schools",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Technician",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Craft Teacher Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Craft Teacher Grade - II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Craft Instructor Grade-I",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Music Teacher Grade-III",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Music Teacher Grade-II / Tabla and Violin Player",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Drawing Teacher Grade-III",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Artist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Drawing Teacher Grade-II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Teacher / Teacher in Deaf, Dumb & Blind School",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Enforcement Assistant / Attendance Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Senior Teacher",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Instructor in B.S.T.C.School Excluding P.T.I., Craft, Drawing and Agriculture Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Enforcement Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Technical Testing Assistants in Bureau of Educational Vocational Guidance",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Technical Assistant in Evaluation Unit",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Supervisor in Audio Visual Education Unit",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Instructor B.S.T.C.School (Senior Grade) excluding Craft and Physical Training Instructor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Junior Agriculture Teacher",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Head of Agricultural Department in Higher Secondary School",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Sahayak Dhwani Chalak",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Glass Blower",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Radio Mechanic",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Chalak",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Fieldman",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Cinema Inspector",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Lady Matron",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Tabla Vadak",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Dhwani Chalak",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Driver & Mechanic",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Senior Laboratory Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Research Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Publicity Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Latheman",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Teacher (Sardul Public School)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Publicity Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Deputy Registrar Departmental Examination",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Academic Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Technician in State Institute of Science Education",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Project Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Programme-cum-Script Writer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Research Assistant State Institute of Education and Science Education",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Senior Teacher (Sardul Public School)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Residential House Master",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Consultant",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Manager",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Research Officer E.T.Cell",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Education Officer Population",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Registrar",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Officer-in-Charge, Adult Education Project",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            }
        ]
    },
    {
        "name": "RAJASTHAN LANGUAGE AND LIBRARY DEPARTMENT",
        "posts": [
            {
                "title": "Librarian Grade-I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Bhasha Adhikari",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "State Librarian",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Librarian Grade -III / Cataloguer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Translator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian Grade -II / Assistant Academic Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Head Translator",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "SANSKRIT EDUCATION DEPARTMENT",
        "posts": [
            {
                "title": "Lecturer (School) / Deputy Inspector",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Head Master, Praveshika School including Sr. Deputy Inspector",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Principal, Varishtha Upadhyaya School",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Divisional Sanskrit Education Officer, Assistant Director, Principal, Sanskrit Teachers Training School",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Joint Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Teacher / P.T.I Grade-III / Librarian Grade-III",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sr.Teacher / Teacher in Arts / Crafts Grade-II / P.T.I Grade-II / Sub-Deputy Inspector / Librarian Grade-II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            }
        ]
    },
    {
        "name": "TECHNICAL EDUCATION DEPARTMENT",
        "posts": [
            {
                "title": "Technician",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Technician Other Shops",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Superintendent ITI / Vice Principal ITI / Lecturer ITI",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director Training / Principal, ITI",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Dy. Apprentice-ship Advisor-cum-Dy. Director of Training",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Dy. Director Training",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Joint Director Training",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Director Training",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Motor Driving Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Instructor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Group Instructor / Surveyor / Assistant Apprentice-ship Advisor Grade-II",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Registrar Board of Technical Education. Rajasthan",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "ELECTION DEPARTMENT",
        "posts": [
            {
                "title": "Machine Operator",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Assistant Chief Electoral Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Deputy Secretary Election & Additional Chief Electoral Officer-cum-Addl Director of Elections",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            }
        ]
    },
    {
        "name": "ELECTRICAL INSPECTORATE",
        "posts": [
            {
                "title": "Assistant Electrical Inspector",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Electrical Inspector",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Sr. Electrical Inspector",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Jr. Electrical Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "EMPLOYMENT EXCHANGE",
        "posts": [
            {
                "title": "District / Assistant Employment Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Director",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Niyojan Sahayak / Rojgar Sahayak",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Employment Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Proof Reader",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Computor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Artist",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            }
        ]
    },
    {
        "name": "ENGINEERING DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Architect",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Architect",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Senior Architect",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Chief Architect",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            }
        ]
    },
    {
        "name": "GROUND WATER DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Executive Engineer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintending Engineer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Chief Engineer",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Junior Chemist / Jr.Geophysist / Jr.Hydrologist / Jr.Hydrometrologist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Chemist / Senior Geophysist / Senior Hydrologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintending Hydrologist / Director, Survey & Research",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Assistant Driller",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Mechanic Pump",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Driller (Percussion)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Driller (Rotary / Air)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Instrument Technician",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Drilling Foreman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Blacksmith",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Borer",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Machineman",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Mechanic Grade-II",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Blaster",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Mechanic Grade-I",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Cylinder, Boring Honning Operator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Miller",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Blasting Supervisor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Workshop Supervisor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Chemical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Surveyor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Technical Assistant Geophysics",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Technical Assistant Chemistry",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Technical Assistant Hydrogeology",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Tin Smith",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Operator Service Lift",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Truck Driver",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Crane Operator",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Heavy Duty Tractor Driver",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Head Draftsman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Technical Assistant Hydrometrology",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Pump Foreman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Instrument Foreman",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Ferroman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Overseer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Information Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Store Verifier (Ministerial service)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Planning Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Supervisor (Electrical / Mechanical / Training)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "HORTICULTURE WING",
        "posts": [
            {
                "title": "Superintendent Gardens",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Sr. Superintendent Gardens",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Horticulturist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Asstt. Inspector",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "PUBLIC HEALTH ENGINEERING DEPARTMENT",
        "posts": [
            {
                "title": "Junior Chemist",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Zoologist",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Chemist",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Executive Engineer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintending Engineer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Superintendent Chemist",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Addl. Chief Engineer",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Chief Chemist",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Chief Engineer",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Moulder Grade-III",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Mason",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Compressor Driver",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Moulder Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Lineman Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Artisan Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Meter Reader / Checker",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Assistant Driller Boring",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Wireman Grade-II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Compounder Grade-II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Moulder Grade-I",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Lineman Grade-I",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Artisan Grade-I",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Meter Repairer Grade-II and Tester",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Junior Filter Attendant",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Driller Boring",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Meter Inspector",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Meter Repairer Grade-I and Tester",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Senior Filter Attendant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Wireman Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Foreman Grade-II",
                "level": "L-9",
                "gradePay": 2800,
                "initialPay": 28700
            },
            {
                "title": "Foreman Grade-I",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Boring Operator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Sr.Laboratory Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sub-Engineer, Civil & Mechanical",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Engineer, Civil & Mechanical",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Ferroman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Head Draftsman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Sample Taker",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Drill Operator Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Mason Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Moharrir",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Driller Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Mechanic-cum-Machineman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Teleophone Attendant - cum- Clerk",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Driller Grade-I",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Lathe Operator",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Motor Mechanic",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Cost Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Electric Supervisor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Stock Verifier",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Administrative Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Junior Hydrogeologist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Hydrogeologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            }
        ]
    },
    {
        "name": "PUBLIC WORKS DEPARTMENT (BUILDING & ROADS)",
        "posts": [
            {
                "title": "Assistant Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Executive Engineer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintending Engineer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Chief Engineer",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Chief Engineer",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Ferroman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Laboratory Operator",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Architectural Junior Draftsman",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Scientific Chemist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Scientist Geologist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Architectural Draftsman",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Engineer / Sub-Engineer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Architectural Draftsman / Estimator / Computer / Heavy Machinery Operator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Architectural Assistant / Head Draftsman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Tractor Assistant",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Road Jamadar Nigranidar",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Cook",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Caner Grade-I",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Telephone Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Driver of Heavy Earth Moving Buldozers & Similar Heavy Vehicles",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Tractor Supervisor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Workshop Supervisor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Stock Verifier",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Manager Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Superintendent, Furniture Store",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Modeller",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Store Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "WATER RESOURCES DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Executive Engineer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintending Engineer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Chief Engineer",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Chief Engineer",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Ferroman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Head Draftsman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Sub-Engineer / Junior Engineer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Ziledar",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Computer Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Deputy Collector",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Signaller",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Head Signaller",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Observer",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Junior Research Assistant",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Silt Analyst",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Sr. Research Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Tractor Driver",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Security Constable",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Security Head Constable",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Patwari / Amin",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Assistant Tractor Driver",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Security Sub-Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Stock Verifier",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Security Inspector",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Research Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Soil Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Research Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Dy. Director Hydrology",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Project Manager",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Research Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            }
        ]
    },
    {
        "name": "EVALUATION DEPARTMENT",
        "posts": [
            {
                "title": "Evaluation Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Compiler",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Investigator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Research Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "EXCISE DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Excise Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "District Excise Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "District Excise Officer (Senior Scale)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Commissioner (Excise)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional Commissioner, (Excise)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Assistant Excise Officer (Preventive)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Excise Officer (Preventive)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Commissioner (Preventive)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional Commissioner (Preventive)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Guard",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Inspector Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Inspector Grade-I",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Sepoy",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Armourer",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Jamadar Grade-II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Jamadar Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Petrolling Officer Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Petrolling Officer Grade-I",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Laboratory Asstt.",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Chemical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Chemical Examiner",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            }
        ]
    },
    {
        "name": "FACTORIES & BOILERS DEPARTMENT",
        "posts": [
            {
                "title": "Inspector",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Inspector",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Chief Inspector",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Chief Inspector",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Deputy Director, Safety Museum & Training Centre / Industrial Hygiene Laboratory",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            }
        ]
    },
    {
        "name": "FOOD & CIVIL SUPPLIES DEPARTMENT",
        "posts": [
            {
                "title": "District Supply Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Commissioner",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Commissioner",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Commissioner",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Enforcement Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Enforcement Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Asstt. District Supply Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "FOREST DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Conservator (Ordinary Scale)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Conservator (Senior Scale)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Conservator (Selection Scale)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Deputy Conservator (Super time Scale)",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Deputy Conservator of Forest (Higher Super time Scale)",
                "level": "L-23",
                "gradePay": 9500,
                "initialPay": 145800
            },
            {
                "title": "Forest Guard",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Assistant Forester",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Forester",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Ranger Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Ranger Grade-I including Wild Life Ranger",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Tractor Guard",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Tracker",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Ferroman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Desert Guard",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Game Watcher",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Head Care taker",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Cook",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Technician",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Motor Mechanic",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Wireless Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Grafting Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Fieldman",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Amin / Surveyor",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Assist Instructor, Survey & Drawing",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Silt Observer",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Zoo Supervisor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Artist",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Bulldozer Operator",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Foreman-cum- Mechanic",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Klin Operator",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Silt Observer-cum-Silt Analyst",
                "level": "L-9",
                "gradePay": 2800,
                "initialPay": 28700
            },
            {
                "title": "Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Wireless Technician",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Research Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Plan Compiler",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Instructor, Survey and Drawing",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Mechanic",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Land Record Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Soil Conservation Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Overseer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Extension Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Zoo Superintendent",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Photo Interpretation Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Agriculture Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Revenue Settlement Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Horticulturist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Soil Conservation Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Agriculture Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Wild Life Warden",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Field Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Research Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Agriculture Engineer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Dupty Chief Wild Life Warden",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Field Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional Chief Wild Life Warden",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            }
        ]
    },
    {
        "name": "GOVERNMENT SECRETARIAT",
        "posts": [
            {
                "title": "Section Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Private Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Secretary",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Senior Deputy Secretary",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Book Binder",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Security Guard",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Mechanic-cum-Operator",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Machineman-cum-Mechanic",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Polisher",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Chief Security Guard",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Lift Mechanic",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Bradma Machine Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Wireman Grade-II-cum-Electrician",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Proof Reader",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Sanitary Inspector",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Technical Assistant (Forest)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Wireman Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Electrical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Head Proof Reader",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Sports Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Maintenance Engineer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Sports Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Secretary to Government (Non IAS)",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            }
        ]
    },
    {
        "name": "RAJASTHAN SECRETARIAT LIBRARIAN STATE & SUBORDINATE SERVICE",
        "posts": [
            {
                "title": "Librarian",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Sr. Librarian",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Dy. Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "GOVERNOR'S SECRETARIAT",
        "posts": [
            {
                "title": "Washerman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Desi Cook",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Butler",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Mason",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Head Cook",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Steward",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Mechanic-Cum-Driver",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "House Keeper",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Telephone Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Library Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Chief",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Controller, Governor's House Hold",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Section Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Librarian",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Private Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            }
        ]
    },
    {
        "name": "H.C.M. RAJASTHAN STATE INSTITUTE OF PUBLIC ADMINISTRATION",
        "posts": [
            {
                "title": "Mechanic for Xerox Machine",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Cook",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Library Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Research Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Manager (for Rest House) Udaipur",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Deputy Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Research Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Publication Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Librarian",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Librarian",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Professor",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Associate Professor",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Professor",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            }
        ]
    },
    {
        "name": "HOME GUARD AND CIVIL DEFENCE DEPARTMENT",
        "posts": [
            {
                "title": "Deputy Commandant",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Commandant",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Dy. Commandant General-cum-Dy. Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Deputy Commandant General-Cum-Dy. Director (Senior Scale)",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Constable",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Fireman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Despatch Rider",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Leading Fireman",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Telephone Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Head Constable",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Sub-Fire Officer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Civil Defence Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Platoon Commander",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sub-inspector & Equivalent Posts",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Company Commander",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Inspector & Equivalent Posts",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "INDUSTRIES DEPARTMENT",
        "posts": [
            {
                "title": "Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Industries Extension Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "District Industries Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Manual Assistant",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Inspector Handloom",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Inspector Salt",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Inspector (W & M)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Economic Investigator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Superintendent Salt",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "INFORMATION & PUBLIC RELATIONS DEPARTMENT",
        "posts": [
            {
                "title": "Public Relation Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Senior Artist",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Camera Man",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Photographer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Chief Photo Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Joint Director",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Additional Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Lightman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Projectionist",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Cataloguer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Library Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Photographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Public Relation Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Enquiry Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Librarian, Information Centre, Jaipur",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "INFORMATION TECHNOLOGY AND COMMUNICATION DEPARTMENT",
        "posts": [
            {
                "title": "Informatics Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Programmer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Programmer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Analyst-Cum-Programmer (Dy. Director)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "System Analyst (Joint Director)",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Additional Director",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Technical Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            }
        ]
    },
    {
        "name": "INTEGRATED CHILD DEVELOPMENT DEPARTMENT AND WOMEN EMPOWERMENT DEPARTMENT",
        "posts": [
            {
                "title": "Child Development Project Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Programme Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Pre-Primary Education Teacher",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Supervisor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Pre-School Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sr. Supervisor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Asstt. Child Development Project Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Nutritionist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Health Instructor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Programme Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Programme Director / Additional Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            }
        ]
    },
    {
        "name": "JAIL DEPARTMENT",
        "posts": [
            {
                "title": "Deputy Superintendent Jail",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Superintendent, Jail Industries",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Superintendent, Jail Grade-II (including Principal Jail Training school)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Superintendent Jail Grade-I",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Dy. Inspector General of Prisons",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Inspector General of Prisons",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Warder / Armourer",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Head Warder",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Chief Head Warder / Assistant Jailor / Deputy Jailor",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Inspector Lock-up / Jailor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Dyer",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Vocational Teacher",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Assistant Factory Supervisor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Convict Teacher / Assistant Teacher",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Education Teacher",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Band Master",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Physical Instructor / Drill Instructor",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Instructor Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Chief Armourer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Lecturer (Senior Teacher)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "LABOUR COURT & INDUSTRIAL TRIBUNAL",
        "posts": [
            {
                "title": "Reader, Labour Court",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Reader, Industrial Tribunal",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "LABOUR & WELFARE DEPARTMENT",
        "posts": [
            {
                "title": "Labour Welfare Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Labour Commissioner",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Dy. Labour Commissioner",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Labour Commissioner",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Addl. Labour Commissioner",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Labour Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "LAW DEPARTMENT",
        "posts": [
            {
                "title": "Sr.Legal Office",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Asstt. Legal Draftsman / Asstt. Legal Remembrancer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Legal Remembrancer",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Joint Legal Remembrancer",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Senior Joint Legal Remembrancer",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Junior Legal Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Librarian Government Advocate Office",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "LOKAYUKTA SACHIVALAYA",
        "posts": [
            {
                "title": "Section Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Private Secretary to Lokayukta / Secretary Lokayukta",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Librarian",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "MAN POWER DEPARTMENT",
        "posts": [
            {
                "title": "Compiler / Computer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Investigator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Statistical Assistant / Research Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Statistical Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "MEDICAL & HEALTH DEPARTMENT",
        "posts": [
            {
                "title": "Lecturer, College of Nursing",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Medical Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Lecturer, College of Nursing",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Principal, College of Nursing",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Senior Medical Officer / Dy. C.M.H.O (FW.) / Health / Malaria",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Junior Specialist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "C.M.H.O. (Other than specialist, Addl. C.M.H.O, Dy. Director, Dy Superintendent, Dy. Controller)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Senior specialist",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Drug Controller",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Principal Chief Medical Officer / Principal Specialist / Additional Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Director",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Senior Demonstrator",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Professor",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Associate Professor",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Professor",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Senior Professor",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Health Worker Female (Old designation A.N.M.)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Nursing Tutor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Nursing Superintendent",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Insect Collector",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Health Worker (Male) (Ordinary Scale)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Health Worker (Male) (Senior Scale)",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Malaria Inspector (Urban)",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Malaria Inspector (Rural)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Malaria Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Sanitary Inspector",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Auxiliary Health Worker",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Health Educator-Cum-Medical Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Propaganda Health Officer / Propaganda Assistant / Publicity Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Technician X-Ray",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Assistant Radiographer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Radiographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Radiographer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Superintendent Radiographer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Nurse Grade-II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Nurse Grade-I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Vaccinator",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Trained Social Worker",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Physiotherapist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Senior Physiotherapist",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Junior Analytical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Analytical Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Projectionist",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Family Welfare Worker",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Sector Supervisor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Health Supervisor Block (Male)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Public Health Nurse Instructor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Urban Extension Educator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Social Science Instructor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Health Education Instructor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Family Welfare Education & Publicity Officer / Health Education and extension Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Machine Operator Offset",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Compositor Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Developer Offset",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Proof Reader Grade-II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Graining Machine Operator Offset / Binding Foreman Offset",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Treadle Machine Operator",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Proof Reader Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Printer Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Compositor Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Layout Artist Offset",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Photo Artist Offset",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Cameraman Offset",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Helio Offsetter",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Machine Operator Offset",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Supervisor, General Foreman Offset Press",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Foreman Grade-II",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Stock Verifier",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Foreman Grade-I",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Literate Attendant",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Tailor",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Book Binder",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Basic Health Worker",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Special Cholera Worker",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Tailor",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Nurse Dai",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Field Worker",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Cook",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Superior Field Worker",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Mason Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Fireman Grade-II",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Electrician -Cum-Plumber",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Glass Blower",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Operator",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Lineman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Wireman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Gas Plant Fitter",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Vulcanizer",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Moulder",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Head Cook",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Dark Room Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Refrigerator Mistry",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Metal Limb Maker",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Animal House Keeper",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Telephone Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Technician",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Female Contact",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Demonstration Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Field Demonstrator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Non-Medical Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Boiler Attendant Grade-II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Ophthalmic Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Lady Health Visitor",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Vaccination Supervisor",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Food Inspector",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Cholera Supervisor",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Sample Collector",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Boiler Attendant Grade-I",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Chargeman Grade-I",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Medical Record Technician",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "T.B. Health Visitor",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Artist-Cum-Draftsman",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Technical Store Keeper",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Mess Manager",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Artist",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Medical Record Keeper",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Medical Record Technician",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Photographer",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Senior Technician",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Non-Medical Team Leader",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Librarian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Coordinator",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Non-Medical Supervisor",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Museum Assistant-Cum-Artist",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Urban Leprosy Worker",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Ophthalmic Technician",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Receptionist",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Laboratory Technician",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "E.C.G Technician",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Librarian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Lady Health Visitor",
                "level": "L-9",
                "gradePay": 2800,
                "initialPay": 28700
            },
            {
                "title": "Artist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Dental Mechanic",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Psychiatric Social Worker",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Composing Reading Incharge",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Life Guard",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Sanitary Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Field Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Laboratory Incharge",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Pharmacist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Case Worker",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Medical Social Worker",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Artist-Cum-Photographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Artist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Electrical Overseer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sub-Editor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Modeller",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Health Education Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Curator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Instrument Curator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Legal Technical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Cuto Technologist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Laboratory Technician",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Hospital Care Taker",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Technical Officer (Guine Warm Eradication Programme)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Publicity Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Public Health Nurse",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Orthotist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Prosthetist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Occupational Therapist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Sr. Technical Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Officer-in-Charge and Instructor in Occupational Therapy",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Instructor in Physiotherapy",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Senior District Public Health Supervisor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Medical Record Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Psychological Counsellor",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Lecturer in Statistics & Demography",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer in Health Education & Family Welfare",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Physical Training Instructor",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Drug Control Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Asstt. Drug Analyst",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Clinical Bio Chemist / Bio-Chemist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Public Analyst",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Radio physicist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Biologist (Entomologist)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Legal Technical Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "District Chief Nursing Superintendent",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Clinical Psychologist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer in Physiotherapy",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Lecturer in Occupational Therapy",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Superintendent Physiotherapy",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Superintendent Occupational Therapy",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Lecturer (Diploma Course in Pharmacy)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Pharmaceutical Chemist & Lecturer in Pharmacy",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Chemical Examiner",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Pathologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Dy. Director (Nursing) / Chief Nursing Superintendent",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Senior Biochemist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Chief Public Analyst",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Principal, Regional Family Welfare Training Centre",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Drug Analyst",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Asstt. Drug Controller (Allopathic)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Zonal Leprosy Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Director Legal and Consumer Protection (Drug Control)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Director (Nursing)",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Head of Department (Incharge, Diploma Course in Pharmacy)",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "State Leprosy Officer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Superintendent Biochemist",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            }
        ]
    },
    {
        "name": "MINES & GEOLOGY DEPARTMENT",
        "posts": [
            {
                "title": "Asstt. Mining Engineer / Geologist / Asstt. Drilling Engineer / Chemist / Assistant Mechanical Engineer / Jr. Geophysicist",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Ceramic Technologist",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Mining Engineer / Technical Asst. / Sr. Geologist / Chemical & Ceramic Engineer / Deputy Drilling Engineer / Mechanical Engineer / Geophysicist Mines Manager Grade-II / Sr. Chemist / Mineral Economist / Petrologist",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintendent Mining Engineer / Superintendent Geologist / Senior Chemical Engineer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Superintending Geophysicist",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Superintending Engineer (Mechanical & Drilling)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Director (Mining) / Additional Director (Geology)",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Additional Director (Petroleum)",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Director",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Rock Drill Operator",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Gas Plant Attendant",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Holest Operator",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Lathoman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Rigman",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Compressor Operator",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Generator Operator",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Section Cutter",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Museum Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Jr. Field Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Senior Section Cutter",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Drill Assistant",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Computer",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Jr. Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Lab Asstt. Senior",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Mechanic",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Mines Foreman Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Senior Field Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Prospecting Supervisor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Surveyor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Driller",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Chemical Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Mechanical Foreman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Senior Surveyor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Mines Foreman Grade-I",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Driller Grade-II",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Head Draftsman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Administrative Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Ceramic Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Map & Drawing Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Driller Grade-I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Certified Surveyor",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Gunman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Nakedar",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Librarian Junior Includes Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Pustakalyadhyaksh (Librarian)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Certified Mines Foreman",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            }
        ]
    },
    {
        "name": "MOTOR GARAGE DEPARTMENT",
        "posts": [
            {
                "title": "Automobile Engineer and Store Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Sr. Automobile Engineer and Store Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Foreman / Mechanical Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Divisional Superintendent",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Vulcaniser",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            }
        ]
    },
    {
        "name": "NATIONAL CADET CORPS DEPARTMENT",
        "posts": [
            {
                "title": "Ship Modelling Store Keeper",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Aeromodelling Instructor",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Ship Modelling Mechanic",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            }
        ]
    },
    {
        "name": "ORIENTAL RESEARCH INSTITUTE",
        "posts": [
            {
                "title": "Senior Research Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Director",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Manuscript Attendant",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Mender / Mender-Cum-Binder",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Preservation Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Copyist",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Junior Research Assistant / Surveyor / Cataloguing Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Photographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian Grade-ll",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "PETROLEUM DEPARTMENT",
        "posts": [
            {
                "title": "Director, Petroleum",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            }
        ]
    },
    {
        "name": "POLICE DEPARTMENT",
        "posts": [
            {
                "title": "Ordinary Scale",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Senior Scale",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Selection Scale",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Supertime Scale",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Higher Supertime Scale",
                "level": "L-23",
                "gradePay": 9500,
                "initialPay": 145800
            },
            {
                "title": "Constable",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Head Constable",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Sub-Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sub-inspector",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Platoon Commander (Sub-Inspector)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Inspector",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Company Commander",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Senior Scientific Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Assistant Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Director",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Jr. Laboratory Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Laboratory Assistant",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Mechanic",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Scientific Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Technical Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Senior Scientific Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Dy. Superintendent of Police",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Addl. Superintendent of Police",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintendent of Police",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Constable",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Head Constable",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Assistant Sub-Inspector",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Sub-Inspector",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Sub-Inspector (Supervisor)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Inspector",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Cook",
                "level": "L-3",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Mechanic, Police Automobile Workshop",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Librarian Grade-III",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Slide Maker",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Photographer Grade-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Photographer Grade-I",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Senior Teacher",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "PRINTING & STATIONERY DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Superintendent",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Superintendent",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Proof Reader Grade-II",
                "level": "L-6",
                "gradePay": 2400,
                "initialPay": 21500
            },
            {
                "title": "Proof Reader Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Head Proof Reader",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Computer",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Head Computer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Binder",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Head Binder",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Binding Foreman",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Printer Grade-II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Printer Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Printing Foreman",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Compositor Grade-II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Compositor Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Composing Foreman",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "General Foreman",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "PROSECUTION DEPARTMENT",
        "posts": [
            {
                "title": "Prosecution Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Director",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Additional Director",
                "level": "L-20",
                "gradePay": 8200,
                "initialPay": 88900
            },
            {
                "title": "Assistant Prosecution Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "RAJASTHAN CIVIL SERVICES APPELLATE TRIBUNAL",
        "posts": [
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "RAJASTHAN PUBLIC SERVICE COMMISSION",
        "posts": [
            {
                "title": "Investigator (Statistical Assistant)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Evaluation Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Coordinating Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Section Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Sr. Librarian",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Assistant Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Private Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Research Officer (Dy. Director, Statistics Dept.)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Controller of Examination",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Deputy Secretary",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Sr. Deputy Secretary",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            }
        ]
    },
    {
        "name": "REGISTRATION & STAMPS DEPARTMENT",
        "posts": [
            {
                "title": "Stamp Vender",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Sub-Registrar",
                "level": "",
                "gradePay": 0,
                "initialPay": 0
            },
            {
                "title": "Inspector, Registration & Stamps",
                "level": "",
                "gradePay": 0,
                "initialPay": 0
            }
        ]
    },
    {
        "name": "REVENUE DEPARTMENT",
        "posts": [
            {
                "title": "Sadar Kanoongo",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Naib Tehsildar",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Tehsildar",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Tehsil Revenue Accountant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "District Revenue Accountant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Inspector Revenue Accounts",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Patwari",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Inspector Land Records / Office Kanoongo",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sub-Editor",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Law Editor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Registrar",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "RURAL DEVELOPMENT & PANCHAYATI RAJ DEPARTMENT",
        "posts": [
            {
                "title": "Lecturer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Engineer (Civil)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Vice Principal, Gram Sevak Training Centre, Mandor (Jodhpur)",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Principal, Gram Sevak Training Centre, Mandor (Jodhpur)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Executive Engineer (Civil)",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Superintending Engineer (Civil)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Instructor Panchayat",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Panchayat Extension Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Engineer (Civil)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Secretary, Zila Parishad",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Bal Badi Teacher",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Artist",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Lady Nutrition Extension Officer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Instructor, Gram Sevak Training Centre Mandor (Jodhpur)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Lecturer, Sociology / Social Service / Anthropology / Accounts, State Institute of Rural Development and Panchayati Raj, Udaipur",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Chief Instructor, Panchayat",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Vice Principal, State Institute of Rural Development and Panchayati Raj, Udaipur",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Deputy Director, Nutrition",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Vikas Adhikari / Assistant Project Officer (Z.P)",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Vikas Adhikari (Senior) / Project Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Additional Chief Executive Officer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Project Director-Cum-Deputy Secretary, Deputy Commissioner",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            }
        ]
    },
    {
        "name": "SCIENCE & TECHNOLOGY DEPARTMENT",
        "posts": [
            {
                "title": "Ferroman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Technician",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Record Keeper",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Surveyor",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Junior Engineer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Scientific Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Curator",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Agriculture Research Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Documentation Assistant-cum-Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Soil Survey Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            }
        ]
    },
    {
        "name": "SETTLEMENT DEPARTMENT",
        "posts": [
            {
                "title": "Amin",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Tracer",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Sadar Munsarim",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "SOCIAL JUSTICE AND EMPOWERMENT DEPARTMENT",
        "posts": [
            {
                "title": "Chief Children Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Chief Probation Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Joint Director",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Additional Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Teacher",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Assistant Superintendent (For Hostel Grade -C)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Social Welfare Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Probation & Prison Welfare Officer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Assistant Superintendent Sadan / Grah",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Project Officer (Survey)",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Superintendent, Sadan / Grah",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "District Children Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Probation Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "District Probation-Cum-Social Welfare Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Craft Teacher / Inspector",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Care Taker",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Leather Worker / Shoemaker",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Nurse / Compounder",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Earmould Technician",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Staff Nurse",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Psychotherapist",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Librarian",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "SOLDIERS, SAILORS & AIRMAN BOARD",
        "posts": [
            {
                "title": "Welfare Organiser",
                "level": "L-3",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Welfare Organiser",
                "level": "L-4",
                "gradePay": 1900,
                "initialPay": 18200
            },
            {
                "title": "Assistant Project Officer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Secretary District Soldiers Board",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "SPECIAL SCHEME ORGANISATION",
        "posts": [
            {
                "title": "Assistant Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Officer-on-Special Duty (Biogas)",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            }
        ]
    },
    {
        "name": "STATE ELECTION COMMISSION",
        "posts": [
            {
                "title": "Private Secretary",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            }
        ]
    },
    {
        "name": "STATE ENTERPRISES DEPARTMENT",
        "posts": [
            {
                "title": "Manager Salt Source Scheme",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Joint Advisor (Financial)",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Inspector Salt",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Area Warden",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            }
        ]
    },
    {
        "name": "STATE INSURANCE & PROVIDENT FUND DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Director",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Director",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Director",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Senior Additional Director",
                "level": "L-23",
                "gradePay": 9500,
                "initialPay": 145800
            },
            {
                "title": "Binder",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Puncher-Cum-Verifier",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Supervisor",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "TOURISM DEPARTMENT",
        "posts": [
            {
                "title": "Assistant Director",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Deputy Director",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Joint Director",
                "level": "L-17",
                "gradePay": 6800,
                "initialPay": 71000
            },
            {
                "title": "Additional Director",
                "level": "L-18",
                "gradePay": 7200,
                "initialPay": 75300
            },
            {
                "title": "Asstt. Tourist Officer",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Asstt. Librarian",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Tourist Officer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "TOWN PLANNING DEPARTMENT",
        "posts": [
            {
                "title": "Asst. Town Planner including Technical Assistant",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Engineer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Deputy Town Planner",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Senior Town Planner",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Town Planner",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Chief Town Planner",
                "level": "L-24",
                "gradePay": 10000,
                "initialPay": 148800
            },
            {
                "title": "Ferroman",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Ferro Printer",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Investigator Grade-II",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Investigator Grade-I",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Junior Engineer / Sub-Engineer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Town Planning Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Research Assistant",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Survey Assistant",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Modeller",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Architectural Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Asstt. Planning Research Officer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Asstt. Urban Designer",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Assistant Architect",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Planning Research Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Architect",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Sr. Planning Research Officer",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            }
        ]
    },
    {
        "name": "TRANSPORT DEPARTMENT",
        "posts": [
            {
                "title": "District Transport Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Transport Commissioner",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Regional Transport Officer",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Joint Transport Commissioner",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Additional Transport Commissioner",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            },
            {
                "title": "Motor Vehicle Sub-Inspector",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Motor Vehicle Inspector",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            }
        ]
    },
    {
        "name": "TREASURY & ACCOUNTS DEPARTMENT",
        "posts": [
            {
                "title": "Stock Verifier (Office Assistant)",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    },
    {
        "name": "TRIBAL AREA DEVELOPMENT DEPARTMENT",
        "posts": [
            {
                "title": "Jr. Research Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Assistant Director",
                "level": "L-14",
                "gradePay": 5400,
                "initialPay": 56100
            },
            {
                "title": "Cartographer",
                "level": "L-7",
                "gradePay": 2400,
                "initialPay": 22400
            },
            {
                "title": "Compiler",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Research Assistant",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Artist",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Librarian",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Agriculture Supervisor",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Telephone Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            }
        ]
    },
    {
        "name": "VIDHI RACHANA SANGTHAN",
        "posts": [
            {
                "title": "Vidhi Rachanakar",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Varishtha Vidhi Rachanakar",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Vidhi Rachana Adhikari",
                "level": "L-16",
                "gradePay": 6600,
                "initialPay": 67300
            },
            {
                "title": "Deputy Secretary, Vidhi Rachana Sangthan",
                "level": "L-19",
                "gradePay": 7600,
                "initialPay": 79900
            },
            {
                "title": "Senior Deputy Secretary, Vidhi Rachana Sangthan",
                "level": "L-21",
                "gradePay": 8700,
                "initialPay": 123100
            }
        ]
    },
    {
        "name": "COMMON POSTS IN VARIOUS DEPARTMENTS",
        "posts": [
            {
                "title": "All posts in existing Grade Pay Rs. 1700 eg. Peon, Helper, Beldar Jamadar, Daftri, Record Litter etc.",
                "level": "L-1",
                "gradePay": 1700,
                "initialPay": 17700
            },
            {
                "title": "Machineman (Duplicating)",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Driver",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Junior Assistant (Old Designation Clerk Grade-II)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Senior Assistant (Old Designation Clerk Grade-I) / Sheristedar-II",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Assistant Administrative Officer (Old Designation Assistant Office Superintendent) / Sheristedar-II",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Stenographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Additional Administrative Officer (Old Designation Office Superintendent- Cum - Assistant Administrative Officer) / Sheristedar-I",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Personal Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Additional Private Secretary",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Administrative Officer",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            },
            {
                "title": "Private Secretary",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            },
            {
                "title": "Establishment Officer",
                "level": "L-15",
                "gradePay": 6000,
                "initialPay": 60700
            }
        ]
    },
    {
        "name": "COMMON POSTS IN GOVERNMENT SECRETARIAT, RAJASTHAN PUBLIC SERVICE COMMISSION, GOVERNOR'S SECRETARIAT, LOKAYUKTA SACHIVALYA, RAJASTHAN HIGH COURT",
        "posts": [
            {
                "title": "All posts in existing Grade Pay Rs. 1700 eg. Peon, Helper, Beldar, Jamadar, Daftri, Record Lifter etc.",
                "level": "L-1",
                "gradePay": 1700,
                "initialPay": 17700
            },
            {
                "title": "Machineman (Duplicating)",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Driver",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Clerk Grade II (Old Designation Lower Division Clerk.)",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Clerk Grade I (Old Designation Upper Division Clerk)",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Stenographer",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Assistant Section Officer (Old Designation Assistant)",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Stenographer",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Personal Assistant",
                "level": "L-11",
                "gradePay": 4200,
                "initialPay": 37800
            },
            {
                "title": "Additional Private Secretary",
                "level": "L-12",
                "gradePay": 4800,
                "initialPay": 44300
            }
        ]
    },
    {
        "name": "SKILLED / TECHNICAL POSTS COMMON IN MANY DEPARTMENTS",
        "posts": [
            {
                "title": "Helper",
                "level": "L-1",
                "gradePay": 1700,
                "initialPay": 17700
            },
            {
                "title": "Helper (Attached to Technical Posts)",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Mistry (in Non-Engineering Departments)",
                "level": "L-2",
                "gradePay": 1750,
                "initialPay": 17900
            },
            {
                "title": "Upholsterer",
                "level": "L-2",
                "gradePay": 2000,
                "initialPay": 17900
            },
            {
                "title": "Photocopier Operator",
                "level": "L-4",
                "gradePay": 2000,
                "initialPay": 19200
            },
            {
                "title": "Lift Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Projector Operator",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Fitter Mistry / Refrigeration Mistry",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Tailor",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Tracer",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Fitter Grade II / Refrigeration Mistry / Pump Operator Grade-II / Blacksmith Grade-II / Painter Grade-II / Welder Grade-II / Turner Grade-II / Fitter Grade-II / Electrician Grade-II / Mechanic Grade- II",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Carpenter",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Mistry (Civil / Mechanical) Grade-III",
                "level": "L-5",
                "gradePay": 2400,
                "initialPay": 20800
            },
            {
                "title": "Jr. Draftsman",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Plumber Grade-I / Pump Operator Grade-I / Blacksmith Grade-I / Painter Grade-I / Welder Grade-I / Turner Grade-I / Fitter Grade-I / Electrician Grade-I / Mechanic Grade-I",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Senior Carpenter",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Mistry (Civil / Mechanical) Grade-II",
                "level": "L-8",
                "gradePay": 2800,
                "initialPay": 26300
            },
            {
                "title": "Sr. Draftsman",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            },
            {
                "title": "Mistry (Civil / Mechanical) Grade-I",
                "level": "L-10",
                "gradePay": 3600,
                "initialPay": 33800
            }
        ]
    }
];


export const MAJOR_CITIES = [
  { name: 'Jaipur', category: 'Y' },
  { name: 'Jodhpur', category: 'Y' },
  { name: 'Bikaner', category: 'Y' },
  { name: 'Ajmer', category: 'Y' },
  { name: 'Kota', category: 'Y' },
  { name: 'Other Cities', category: 'Z' }
];

export const getHraRate = (category: 'Y' | 'Z', daRate: number): number => {
  if (category === 'Y') return daRate >= 50 ? 20 : 18;
  return daRate >= 50 ? 10 : 9;
};

export const getCCARate = (basicPay: number, cityName: string): number => {
  if (cityName === 'Jaipur') return basicPay <= 23100 ? 620 : 1000;
  const yCategoryCities = ['Bikaner', 'Jodhpur', 'Kota', 'Ajmer'];
  if (yCategoryCities.includes(cityName)) return basicPay <= 23100 ? 320 : 620;
  return 0;
};

export const NPA_PERCENT = 0.20; 
export const WASH_ALLOWANCE_FIXED = 180;

export const RGHS_SLABS = [
  { maxPay: 18000, rate: 265 },
  { maxPay: 33500, rate: 440 },
  { maxPay: 54000, rate: 658 },
  { maxPay: Infinity, rate: 875 }
];

export const SI_SLABS = [
  { minPay: 1, maxPay: 22000, rate: 800 },
  { minPay: 22001, maxPay: 28500, rate: 1200 },
  { minPay: 28501, maxPay: 46500, rate: 2200 },
  { minPay: 46501, maxPay: 72000, rate: 3000 },
  { minPay: 72001, maxPay: Infinity, rate: 5000 },
  { minPay: Infinity, maxPay: Infinity, rate: 7000 }
];

export const GPF_SLABS = [
  { maxPay: 23100, rate: 1450 },
  { maxPay: 28500, rate: 1625 },
  { maxPay: 38500, rate: 2100 },
  { maxPay: 51500, rate: 2850 },
  { maxPay: 62000, rate: 3575 },
  { maxPay: 72000, rate: 4200 },
  { maxPay: 80000, rate: 4800 },
  { maxPay: 116000, rate: 6150 },
  { maxPay: 167000, rate: 8900 },
  { maxPay: Infinity, rate: 10500 }
];
