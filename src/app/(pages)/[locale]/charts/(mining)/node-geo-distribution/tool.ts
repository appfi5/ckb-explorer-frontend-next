

const mapCountryShortNameToFull = {
  // 新加坡
  "SG": "Singapore", // [ "Singapore", "Jurong West", "Bedok New Town", "Marine Parade" ],
  // 荷兰
  "NL": "Netherlands", // ["Amsterdam", "The Hague", "Haarlem", "Breda"],
  // 美国
  "US": "United States", // ["Cheyenne", "Milwaukee", "Los Angeles", "Coral Springs", "Ashburn", "Beltsville", "Citrus Heights", "San Jose", "Denver", "Alabaster", "Missoula", "Eau Claire", "Seattle", "Tallahassee", "Bystrom", "Alexander City", "Houston", "Mount Pocono", "State College", "Sanford", "North Wales", "Philadelphia", "Mission", "Lancaster", "New York City", "Marinette", "Kansas City", "Odessa", "Moore Haven", "Chicago", "Beavercreek", "Washington", "Portland", "Orem", "Roseland", "Albuquerque", "Salinas", "Smyrna", "Sidney", "Minneapolis", "Brighton", "Boardman", "Detroit", "Dallas", "Mechanicsville", "Waite Park", "Madison", "Menlo Park", "Herreid", "Juneau", "Ellicott City", "Pittston", "Glendora", "Orlando", "Atlanta", "Fairfield", "New Boston", "Romeoville", "Flint", "Miami", "Florissant", "Florin", "Redmond", "Binghamton", "Farmington", "Round Top", "Deltona", "Greensboro", "Boise", "Phoenix", "Pontiac", "Allen", "Edinburg", "Bull Run", "Port Clinton", "Charlotte", "Tybee Island", "Dubuque", "Elgin", "Winchester"],
  // 德国
  "DE": "Germany", // [ "Lüneburg", "Balingen", "Fischerbach", "Frankfurt am Main", "Kempten (Allgäu)", "Dortmund", "Hansestadt Stade", "Hamburg", "Memmingen", "Bremen", "Berlin", "Falkenstein", "Nürnberg", "Dresden", "Bergkirchen", "Sinsheim", "Wiehl", "Leisnig", "Landshut"],
  // 比利时
  "BE": "Belgium", // ["Antwerpen", "Charleroi", "Mons", "Zaventem", "Liège", "Brussels", "Bastogne", "Wetteren"],
  // 香港
  "HK": "China", // [ "Hong Kong", "Tung Chung" ],
  // 加拿大 
  "CA": "Canada", // [ "Toronto", "Calgary", "Laval", "London", "Kitchener", "Surrey", "Shawville", "Montréal", "Saskatoon", "Wasaga Beach", "Edmonton", "Brampton", "Kingston", "Roberval", "Blainville", "Beauharnois"],
  // 印度
  "IN": "India", // [ "Mumbai", "Vadodara" ],
  // 墨西哥
  "MX": "Mexico", // [ "Mexico City", "Tijuana" ],
  // 巴西
  "BR": "Brazil", // [ "Bragança Paulista", "Rio de Janeiro", "São Paulo", "Montes Claros", "São José do Rio Preto", "Campinas", "Caruaru", "Fortaleza", "Diadema", "Maringá" ],
  // 日本
  "JP": "Japan", // [ "Tokyo", "Togoshi", "Osaka"],
  // 澳大利亚
  "AU": "Australia", // [ "Adelaide", "Melbourne", "Perth", "Sydney", "Brisbane"],
  // 芬兰
  "FI": "Finland", // ["Helsinki"],
  // 克罗地亚
  "HR": "Croatia", // [ "Zagreb" ],
  // 阿拉伯
  "AE": "United Arab Emirates", // [ "Dubai", "Ajman"],
  // 土耳其
  "TR": "Turkey", // ["Ankara"],
  // 法国
  "FR": "France", // [ "Annecy", "Nantes", "Paris", "Rennes", "La Roche-sur-Yon", "Schiltigheim", "Anse", "Lille", "Marseille", "Belfort", "Irigny", "Béziers", "Atur", "Marange-Silvange", "Gattières", "Voisins-le-Bretonneux", "Chelles", "Aix-les-Bains", "Le Havre", "Saint-Étienne", "Talant", "Chantepie", "Saint-Quentin", "Bonneville", "Nogent-sur-Seine", "Fontaine-le-Comte", "Bayonne", "Vannes", "La Motte-d'Aveillans", "Parmain", "La Norville", "Arc-sur-Tille"],
  // 瑞士
  "CH": "Switzerland", // [ "Bern", "Zürich", "Lausanne", "Bulle", "Emmen", "Muttenz" ],
  // 台湾
  "TW": "China", // [ "Taoyuan City", "Taipei" ],
  // 匈牙利
  "HU": "Hungary", // ["Budapest"],
  // 爱尔兰
  "IE": "Ireland", // [ "Dublin", "Carrick-on-Shannon" ],
  // 南非
  "ZA": "South Africa", // [ "Cape Town" ],
  // 斯洛伐克
  "SK": "Slovakia", // [ "Bratislava" ],
  // 中国
  "CN": "China", // ["Beijing","Hangzhou","Chongqing","Shanghai","Wuhan","Nanjing","Tianjin","Jinrongjie"],
  // 西班牙
  "ES": "Spain", // ["Barcelona", "Guadalajara", "Madrid"],
  // 葡萄牙
  "PT": "Portugal", // ["Queluz","Esposende","Vila Nova de Gaia" ],
  // 英国
  "GB": "United Kingdom", // [ "London", "Leicester", "Manchester", "Kingston upon Hull", "Stockport" ],
  // 马来西亚
  "MY": "Malaysia", // [ "Kuala Rompin", "Sri Petaling", "Petaling Jaya"],
  // 希腊
  "GR": "Greece", // ["Chaïdári","Kateríni","Athens"],
  // 泰国
  "TH": "Thailand", // ["Bangkok", "Chiang Mai"],
  // 老挝
  "LA": "Lao PDR", // ["Vientiane"],
  // 乌克兰
  "UA": "Ukraine", // ["Donetsk"],
  // 斯洛文尼亚
  "SI": "Slovenia", // ["Maribor","Sevnica"],
  // 菲律宾
  "PH": "Philippines",// ["Cebu City","Calamba"],
  // 立陶宛
  "LT": "Lithuania", // ["Vilnius","Kaunas"],
  // 韩国
  "KR": "Korea", // ["Incheon", "Seoul"],
  // 挪威
  "NO": "Norway", // ["Bergen"],
  // 卢森堡
  "LU": "Luxembourg", // ["Esch-sur-Alzette","Luxembourg"],
  // 印度尼西亚
  "ID": "Indonesia", // ["Jakarta"],
  // 保加利亚
  "BG": "Bulgaria", // ["Sofia"],
  // 奥地利
  "AT": "Austria", // ["Bad Goisern"],
  // 摩洛哥
  "MA": "Morocco", // ["Casablanca"],
  // 科威特
  "KW": "Kuwait", // ["Şabāḩ as Sālim"],
  // 俄罗斯
  "RU": "Russia", // ["Voronezh","Nizhniy Novgorod","Saint Petersburg"],
  // 波兰
  "PL": "Poland", //  ["Ursynów","Siemianowice Śląskie"],
  // 瑞典
  "SE": "Sweden", // ["Stockholm","Huddinge"],
  // 塞浦路斯
  "CY": "Cyprus", // ["Nicosia"],
  // 阿尔巴尼亚
  "AL": "Albania", // ["Tirana"],
  // 捷克
  "CZ": "Czech Rep.", // ["Prague"],
  // 意大利
  "IT": "Italy", // ["Milan","Cosenza"],
  // 罗马尼亚
  "RO": "Romania", // ["Timişoara"],
  // 黎巴嫩
  "LB": "Lebanon", // ["Beirut"],
  // 巴林
  "BH": "Bahrain", // ["Ar Rifā‘"]
}

export default function mapCountryShortNameToCountryName(shortName: string) {
  const fullName = mapCountryShortNameToFull[shortName];
  return fullName
}