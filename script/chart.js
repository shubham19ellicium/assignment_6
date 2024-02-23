
let USER_NAME_SESSION = sessionStorage.getItem("username")
var chart = am4core.create("chartdiv", am4charts.XYChart);

let obj = {

}

function createChart(data) {

    chart.data = data

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    categoryAxis.title.text = "Date";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Litres sold (M)";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "amount";
    series.dataFields.categoryX = "date";
    series.name = "Sales";
    series.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
    series.columns.template.fill = am4core.color("#104547");

}
var arr = []
const fetchCompleteData = async () => {
    const response = await fetch(`http://localhost:3000/expense?username=${USER_NAME_SESSION}&_sort=id&_order=desc`);
    const jsonData = await response.json();
    console.log("DATA :: ", jsonData);

    

    var n = jsonData.map(data => {
        var obj = data
        obj.date = getMonthFromDay(data.date)
        return obj
    })
    console.log(JSON.stringify(n, null, 2));
    
    createChart(n)
}

fetchCompleteData()

function getMonthFromDay(date) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthFlag = new Date(date).getMonth()
    return month[monthFlag]
}







// Add data
// chart.data = [{
//     "country": "Lithuania",
//     "litres": 501.9,
// }
//     , {
//     "country": "Czech Republic",
//     "litres": 301.9,
// }
//     , {
//     "country": "Ireland",
//     "litres": 201.1,
// }
//     , {
//     "country": "Germany",
//     "litres": 165.8,
// }
//     , {
//     "country": "Australia",
//     "litres": 139.9,
// }
//     , {
//     "country": "Austria",
//     "litres": 128.3,
// }
//     , {
//     "country": "UK",
//     "litres": 99,
// }
//     , {
//     "country": "Belgium",
//     "litres": 60,
// }
//     , {
//     "country": "The Netherlands",
//     "litres": 50,
// }
// ];

