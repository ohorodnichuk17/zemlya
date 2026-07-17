export const crops : Record<string,{index: number,name : string}> 
= {
    "Wheat":{index:0,name:"Пшениця"},
    "Sunflower":{index:1,name:"Соняшник"},
    "Corn":{index:2,name:"Кукурудза"}
};


export const soils : Record<string,{index: number,name : string}> 
= {
    "Chernozem":{index:0,name:"Чорнозем"},
    "Clay":{index:1,name:"Глина"},
    "Podzol":{index:2,name:"Підзолистий"}
};

export const shellingImpactLevels : Record<string,{index: number,name : string}> 
= {
    "None":{index:0,name:"Відсутній (Безпечно)"},
    "Low":{index:1,name:"Низький (Поблизу)"},
    "Medium":{index:2,name:"Середній (Воронки поруч)"},
    "High":{index:3,name:"Високий (Прямі влучання)"}
};
export const agroClimaticZones : Record<string, string> 
= {
    "Polissya":"Полісся",
    "Steppe":"Степ"
};
export const growthStages : Record<string, string> 
= {
    "Germination":"Проростання",
    "Vegetative":"Степ",
    "Flowering":"Цвітіння",
    "Maturity":"Зрілість",
    "Harvested":"Зібрано"
};
export const weatherDescriptions : Record<string, string> 
= {
    "thunderstorm with light rain":"Гроза з невеликим дощем",
    "thunderstorm with rain":"Гроза з дощем",
    "thunderstorm with heavy rain":"Гроза з сильним дощем",
    "light thunderstorm":"Легка гроза",
    "thunderstorm":"Гроза",
    "heavy thunderstorm":"Сильна гроза",
    "ragged thunderstorm":"Нерівномірна гроза",
    "thunderstorm with drizzle":"Гроза з мрякою",
    "light intensity drizzle":"Мряка слабкої інтенсивності",
    "drizzle":"Мряка",
    "heavy intensity drizzle":"Сильна мряка",
    "drizzle rain (light, normal, heavy)":"Мряка (легка, звичайна, сильна)",
    "shower rain and drizzle":"Дощ з мрякою",
    "shower drizzle":"Мряка з дощу",
    "light rain":"Невеликий дощ",
    "moderate rain":"Помірний дощ",
    "heavy to extreme rain":"Сильний до екстремальних дощів",
    "freezing rain":"Крижагий дощ",
    "shower rain (light, normal, heavy)":"Злива (легка, звичайна, сильна)",
    "ragged shower rain":"Нерівномірний дощ",
    "light snow":"Легкий снігопад",
    "snow":"Снігопад",
    "heavy snow":"Сильний снігопад",
    "sleet (light, normal, shower)":"Мокрий сніг (невеликий, нормальний, злива)",
    "rain and snow (light, normal)":"Дощ з нігом (легкий, нормальний)",
    "shower snow (light, normal, heavy)":"Сніжна злива (легка, звичайна, сильна)",
    "mist":"Легкий туман",
    "smoke":"Дим",
    "haze":"Імла",
    "sand/dust whirls":"Піщані/пилові вихори",
    "fog":"Туман",
    "sand":"Піщана",
    "dust":"Пилова",
    "volcanic ash":"Вулканічний попіл",
    "squalls":"Шквал",
    "tornado":"Торнадо",
    "clear sky":"Чисте небо",
    "few clouds (11–25%)":"Невелика хмарність (11-25%)",
    "scattered clouds (25–50%)":"Розсіяна хмарність (25-50%)",
    "broken clouds (51–84%)":"Значна хмарність (51-84%)",
    "overcast clouds (85–100%)":"Похмурна хмарність (85-100%)",
};