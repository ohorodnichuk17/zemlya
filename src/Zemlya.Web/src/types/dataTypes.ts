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
