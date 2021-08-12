const ip = 'http://192.168.239.16:5000/'
canv = document.getElementById("canvas");
ctx = canv.getContext("2d");
function checkbox() {
    if (result) {
        if (document.getElementById("checkbox").checked) {
            createInstructionButtons()
            document.getElementById("currectline").innerText=currectLine
            clearCanvas()
            ctx.moveTo(result[currectLine][0][0], result[currectLine][0][1])
            ctx.lineTo(result[currectLine][1][0], result[currectLine][1][1])
            ctx.stroke()
        }
        else {
            deleteButtons()
            document.getElementById("currectLine").innerText=null
            ctx.lineWidth = document.getElementById("lineWidthRange").value
            for (var i = 0; i < result.length; i++) {
                ctx.moveTo(result[i][0][0], result[i][0][1]);
                ctx.lineTo(result[i][1][0], result[i][1][1]);
                
                // ctx.lineWidth = document.getElementById("lineWidthRange").value
            }
            ctx.stroke()
        }
    }
}
function increment() {
    if (currectLine < result.length - 1) {
        currectLine++
        document.getElementById("currectLine").innerText = currectLine + 1
        clearCanvas()
        ctx.moveTo(result[currectLine][0][0], result[currectLine][0][1])
        ctx.lineTo(result[currectLine][1][0], result[currectLine][1][1])
        ctx.stroke()
    }
}
function decrement() {
    if (currectLine > 0) {
        currectLine--
        document.getElementById("currectLine").innerText = currectLine + 1
        clearCanvas()
        ctx.moveTo(result[currectLine][0][0], result[currectLine][0][1])
        ctx.lineTo(result[currectLine][1][0], result[currectLine][1][1])
        ctx.stroke()
    }
}
function createInstructionButtons() {
    document.getElementById("instructionButtonNext").innerHTML = "<button>next</button>"
    document.getElementById("instructionButtonPrevious").innerHTML = "<button>previous</button>"
    document.getElementById("currectLine").innerText = currectLine + 1
    document.getElementById("instructionButtonPrevious").setAttribute("onclick", "decrement()")
    document.getElementById("instructionButtonNext").setAttribute("onclick", "increment()")
}
function deleteButtons() {
    document.getElementById("instructionButtonNext").innerHTML = ""
    document.getElementById("instructionButtonPrevious").innerHTML = ""
}
var currectLine
function synchronizationlineWidthRange() {
    if (document.getElementById("lineWidthRange").value != document.getElementById("lineWidthText").value) {
        document.getElementById("lineWidthText").value = document.getElementById("lineWidthRange").value
        ctx.lineWidth = document.getElementById("lineWidthRange").value;
    }
}
function synchronizationlineWidthText() {
    if (document.getElementById("lineWidthRange").value != document.getElementById("lineWidthText").value) {
        document.getElementById("lineWidthRange").value = document.getElementById("lineWidthText").value
    }
}
function synchronizationlineNumRange() {
    if (document.getElementById("lineNumRange").value != document.getElementById("lineNumText").value) {
        document.getElementById("lineNumText").value = document.getElementById("lineNumRange").value
    }
}
function synchronizationlineNumText() {
    if (document.getElementById("lineNumRange").value != document.getElementById("lineNumText").value) {
        document.getElementById("lineNumRange").value = document.getElementById("lineNumText").value
    }
}
function clearCanvas() {
    ctx.clearRect(0, 0, 383, 383);
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(190, 190, 190, 0, (2 * Math.PI), false);
    ctx.setLineDash([3]);
    ctx.stroke()
    ctx.setLineDash([0])
}

ctx.beginPath()
ctx.arc(190, 190, 190, 0, (2 * Math.PI), false);
ctx.setLineDash([3]);
ctx.stroke()
ctx.setLineDash([0])





var result
function change() {
    if (result) {
        afterResponse(result)
    }
}
function afterResponse(succes) {
    if (document.getElementById("checkbox").checked) {
        createInstructionButtons()
    }
    document.getElementById("loader").setAttribute("class", "y")
    result = succes
    clearCanvas()
    ctx.lineWidth = document.getElementById("lineWidthRange").value
    checkbox()
    ctx.stroke()
    ctx.closePath()
}

// Select your input type file and store it in a variable
const input = document.getElementById('file');
console.log('i', input)

// This will upload the file after having read it
const upload = (file) => {
    currectLine = 0
    clearCanvas()
    document.getElementById("loader").setAttribute("class", "loader")
    var settings = [document.getElementById("lineNumText").value]
    const formData = new FormData();
    formData.append('file', file);
    formData.append('json', JSON.stringify(settings));
    console.log("sending")

    fetch(ip, { // Your POST endpoint
        method: 'POST',
        body: formData, // This is your file object
        // headers: {
        //     "Accept": "application/json",
        //     "Content-Type": "application/json"
        // }
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
const onSelectFile = () => {
    if (input.files[0]) {
        upload(input.files[0])
    }
    else {
        alert("Выберите файл")
    }
};
const submit = document.getElementById("filesend")
submit.addEventListener("click", onSelectFile, false)

// submit.addEventListener("click", clearCanvas, false)
// Add a listener on your input
// It will be triggered when a file will be selected


// [[[откуда][куда]],[[][]],[[][]],[[][]]]
