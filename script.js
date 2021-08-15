const ip = 'http://localhost:5000/'
var currentLine
var from
var to

canv = document.getElementById("canvas");
ctx = canv.getContext("2d");
function checkbox() {
    if (result) {
        if (document.getElementById("checkbox").checked) {
            document.getElementById("lineNumRange").disabled = true
            document.getElementById("lineNumText").disabled = true
            document.getElementById("lineWidthRange").disabled = true
            document.getElementById("lineWidthText").disabled = true
            document.getElementById("filesend").disabled = true
            document.getElementById("file").disabled = true
            createInstructionButtons()
            clearCanvas()
            ctx.moveTo(result[0][currentLine][0][0], result[0][currentLine][0][1])
            ctx.lineTo(result[0][currentLine][1][0], result[0][currentLine][1][1])
            ctx.stroke()

            if (result[1][currentLine][0] + 91 > 360) {
                from = result[1][currentLine][0] - 269
            }
            else {
                from = result[1][currentLine][0] + 91
            }
            if (result[1][currentLine][1] + 91 > 360) {
                to = result[1][currentLine][1] - 269
            }
            else {
                to = result[1][currentLine][1] + 91
            }
            document.getElementById("instruct1").innerText = "Шаг " + (currentLine + 1) + ": " + from + " - " + to
        }
        else {
            document.getElementById("instruct1").innerText = null
            deleteButtons()
            clearCanvas()
            document.getElementById("lineNumRange").disabled = false
            document.getElementById("lineNumText").disabled = false
            document.getElementById("lineWidthRange").disabled = false
            document.getElementById("lineWidthText").disabled = false
            document.getElementById("filesend").disabled = false
            document.getElementById("file").disabled = false
            ctx.lineWidth = document.getElementById("lineWidthRange").value
            for (var i = 0; i < result[0].length; i++) {
                ctx.moveTo(result[0][i][0][0], result[0][i][0][1]);
                ctx.lineTo(result[0][i][1][0], result[0][i][1][1]);

                // ctx.lineWidth = document.getElementById("lineWidthRange").value
            }

            ctx.stroke()
        }
    }
}
function increment() {
    if (currentLine < result[0].length - 1) {
        currentLine++
        
        clearCanvas()
        
        if (result[1][currentLine][0] + 91 > 360) {
            from = result[1][currentLine][0] - 269
        }
        else {
            from = result[1][currentLine][0] + 91
        }
        if (result[1][currentLine][1] + 91 > 360) {
            to = result[1][currentLine][1] - 269
        }
        else {
            to = result[1][currentLine][1] + 91
        }

        ctx.moveTo(result[0][currentLine][0][0], result[0][currentLine][0][1])
        ctx.lineTo(result[0][currentLine][1][0], result[0][currentLine][1][1])
        ctx.stroke()


        document.getElementById("instruct1").innerText = "Шаг " + (currentLine + 1) + ": " + from + " - " + to
    }
}
function decrement() {
    if (currentLine > 0) {
        currentLine--
        clearCanvas()
        ctx.moveTo(result[0][currentLine][0][0], result[0][currentLine][0][1])
        ctx.lineTo(result[0][currentLine][1][0], result[0][currentLine][1][1])
        ctx.stroke()

        if (result[1][currentLine][0] + 91 > 360) {
            from = result[1][currentLine][0] - 269
        }
        else {
            from = result[1][currentLine][0] + 91
        }
        if (result[1][currentLine][1] + 91 > 360) {
            to = result[1][currentLine][1] - 269
        }
        else {
            to = result[1][currentLine][1] + 91
        }
        document.getElementById("instruct1").innerText = "Шаг " + (currentLine + 1) + ": " + from + " - " + to
    }
}
function createInstructionButtons() {
    document.getElementById("instructionButtonNext").innerHTML = "<button>next</button>"
    document.getElementById("instructionButtonPrevious").innerHTML = "<button>previous</button>"
    document.getElementById("instructionButtonPrevious").setAttribute("onclick", "decrement()")
    document.getElementById("instructionButtonNext").setAttribute("onclick", "increment()")
}
function deleteButtons() {
    document.getElementById("instructionButtonNext").innerHTML = ""
    document.getElementById("instructionButtonPrevious").innerHTML = ""
}

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
    currentLine = 0
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
