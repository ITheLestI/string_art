
function synchronizationPercentText() {
    if (document.getElementById("percentRange").value != document.getElementById("percentText").value) {
        document.getElementById("percentRange").value = document.getElementById("percentText").value
    }
}
function synchronizationPercentRange() {
    if (document.getElementById("percentRange").value != document.getElementById("percentText").value) {
        document.getElementById("percentText").value = document.getElementById("percentRange").value
    }
}
function synchronizationHorizontalRange() {
    if (document.getElementById("horizontalRange").value != document.getElementById("horizontalText").value) {
        document.getElementById("horizontalText").value = document.getElementById("horizontalRange").value
    }
}
function synchronizationHorizontalText() {
    if (document.getElementById("horizontalRange").value != document.getElementById("horizontalText").value) {
        document.getElementById("horizontalRange").value = document.getElementById("horizontalText").value
    }
}
function synchronizationVerticalRange() {
    if (document.getElementById("verticalRange").value != document.getElementById("verticalText").value) {
        document.getElementById("verticalText").value = document.getElementById("verticalRange").value
    }
}
function synchronizationVerticalText() {
    if (document.getElementById("verticalRange").value != document.getElementById("verticalText").value) {
        document.getElementById("verticalRange").value = document.getElementById("verticalText").value
    }
}
canv = document.getElementById("canvas");
ctx = canv.getContext("2d");
ctx.arc(190, 190, 190, 0, (2 * Math.PI), false);
ctx.setLineDash([3]);
ctx.stroke()
ctx.setLineDash([0])


var settings=[]
var result
function afterResponse(succes) {
    result = succes
    for (var i = 0; i < result.length; i++) {
        ctx.moveTo(result[i][0][0], result[i][0][1]);
        ctx.lineTo(result[i][1][0], result[i][1][1]);
        ctx.lineWidth = 0.3;
        ctx.stroke
    }
    ctx.stroke()
}
// Select your input type file and store it in a variable
const input = document.getElementById('submit');
console.log('i', input)

// This will upload the file after having read it
const upload = (file) => {
    document.getElementsByClassName("settings").setAttribute("disabled",true)
    const formData = new FormData();
    formData.append('file', file);
    console.log("sending")
    fetch('http://192.168.239.72:5000/', { // Your POST endpoint
        method: 'POST',
        body: formData // This is your file object
    }).then(
        response => response.json() // if the response is a JSON object
    ).then(
        succes => afterResponse(succes)
        //succes => afterResponse(succes)
    ).catch(
        error => console.log(error) // Handle the error response object
    );
};

// Event handler executed when a file is selected
const onSelectFile = () => upload(input.files[0]);
input.addEventListener("click",onSelectFile,false)
// Add a listener on your input
// It will be triggered when a file will be selected

if (result) {
    console.log(result)
}
// [[[откуда][куда]],[[][]],[[][]],[[][]],536]