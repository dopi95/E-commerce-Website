export const DisplayPriceInRupees = (price)=>{
    return new Intl.NumberFormat('en-ET',{
        style : 'currency',
        currency : 'ETB'
    }).format(price)
}