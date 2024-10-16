type Bien ={
    id: string;
    url: string;
    name: string;
    prix: number;
    lieu: string;
    nbPiece: number;
    metreCarre:number ;
    terrain: number;
} ;


export function getAllBien(): Array<Bien>{
    return biens;
}

export function getBienById(id:string): Bien | undefined{
    return biens.find((b)=> b.id === id);
}




const biens =[
    {
        id: "1",
        url: "https://www.seloger.com/annonces/achat/maison/albi-81/la-mouline-le-go-la-renaudie-la-viscose/212991487.htm?projects=2,5&types=2,1&natures=1,2,4&places=[{%22inseeCodes%22:[810004]}]&enterprise=0&qsVersion=1.0&m=search_to_detail&lv=L",
        name: "Maison",
        prix: 395000,
        lieu: "Quartier La Mouline - Le Gô - La Renaudié - La Viscose à Albi (81000)",
        nbPiece:5,
        metreCarre:145,
        terrain:1737
    },
    
    {
        id: "2",
        url: "https://www.seloger.com/annonces/achat-de-prestige/appartement/albi-81/la-panousse-st-martin-val-de-caussels-jarlard-le-peyroulie/228562773.htm?projects=2,5&types=2,1&natures=1,2,4&places=[{%22inseeCodes%22:[810004]}]&enterprise=0&qsVersion=1.0&m=search_to_detail&lv=L",
        name: "Appartement",
        prix: 79400 ,
        lieu: "Quartier La panousse - St Martin - Val de Caussels - Jarlard - Le Peyroulié à Albi (81000)",
        nbPiece:2,
        metreCarre:34,
        terrain:0
        }




];

