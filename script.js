let chart;

function run() {
    let req = document.getElementById("requests").value.split(',').map(Number);
    let head = parseInt(document.getElementById("head").value);
    let algo = document.getElementById("algo").value;

    let result;

    if (algo === "fcfs") result = fcfs(req, head);
    else if (algo === "sstf") result = sstf(req, head);
    else if (algo === "scan") result = scan(req, head);
    else if (algo === "cscan") result = cscan(req, head);
    else if (algo === "look") result = look(req, head);
    else if (algo === "clook") result = clook(req, head);

    document.getElementById("result").innerHTML =
        "Sequence: " + [head, ...result.sequence].join(" → ") +
        "<br>Total Seek Time: " + result.seek;

    drawGraph(head, result.sequence);
}

/* -------- COMMON SEEK CALC -------- */
function calcSeek(head, seq) {
    let seek = 0, current = head;
    for (let r of seq) {
        seek += Math.abs(r - current);
        current = r;
    }
    return seek;
}

/* -------- FCFS -------- */
function fcfs(req, head) {
    let seq = [...req];
    let seek = calcSeek(head, seq);
    return { sequence: seq, seek };
}

/* -------- SSTF -------- */
function sstf(req, head) {
    let requests = [...req];
    let seq = [];
    let current = head;

    while (requests.length) {
        let closest = requests.reduce((a, b) =>
            Math.abs(a - current) < Math.abs(b - current) ? a : b
        );
        seq.push(closest);
        current = closest;
        requests = requests.filter(r => r !== closest);
    }

    let seek = calcSeek(head, seq);
    return { sequence: seq, seek };
}

/* -------- SCAN -------- */
function scan(req, head) {
    let diskSize = 200;

    let left = req.filter(r => r < head).sort((a,b)=>b-a);
    let right = req.filter(r => r >= head).sort((a,b)=>a-b);

    let seq = [...right, diskSize - 1, ...left];
    let seek = calcSeek(head, seq);

    return { sequence: seq, seek };
}

/* -------- C-SCAN -------- */
function cscan(req, head) {
    let diskSize = 200;

    let left = req.filter(r => r < head).sort((a,b)=>a-b);
    let right = req.filter(r => r >= head).sort((a,b)=>a-b);

    let seq = [...right, diskSize - 1, 0, ...left];
    let seek = calcSeek(head, seq);

    return { sequence: seq, seek };
}

/* -------- LOOK -------- */
function look(req, head) {
    let left = req.filter(r => r < head).sort((a,b)=>b-a);
    let right = req.filter(r => r >= head).sort((a,b)=>a-b);

    let seq = [...right, ...left];
    let seek = calcSeek(head, seq);

    return { sequence: seq, seek };
}

/* -------- C-LOOK -------- */
function clook(req, head) {
    let left = req.filter(r => r < head).sort((a,b)=>a-b);
    let right = req.filter(r => r >= head).sort((a,b)=>a-b);

    let seq = [...right, ...left];
    let seek = calcSeek(head, seq);

    return { sequence: seq, seek };
}

/* -------- GRAPH -------- */
function drawGraph(head, sequence) {

    let data = [head, ...sequence];

    if (chart) chart.destroy();

    let ctx = document.getElementById("chart").getContext("2d");

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => "Step " + i),
            datasets: [{
                label: "Head Movement",
                data: data,
                fill: false,
                tension: 0
            }]
        }
    });
}