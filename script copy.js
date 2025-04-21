let timerInterval;
let startTime;
let studySessions = [];
const startStopButton = document.getElementById('start-stop-button');
const titleInput = document.getElementById('title');
const memoInput = document.getElementById('memo');
const recordsBody = document.getElementById('records-body');
const endTimeButton = document.getElementById('end-day-button');
const currentTimeElement = document.getElementById('current-time');

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

async function startTimer() {
    if (!titleInput.value.trim()) {
        alert('タイトルを入力してください。');
        return;
    }
    const title = titleInput.value.trim();
    const memo = memoInput.value.trim();
    startTime = new Date();
    startStopButton.textContent = '終了';
    timerInterval = setInterval(updateTime, 1000);
    // 開始時にサーバーに通知することも可能ですが、今回は終了時のみとします
}

async function stopTimer() {
    clearInterval(timerInterval);
    const endTime = new Date();
    const duration = calculateDuration(startTime, endTime);
    const title = titleInput.value.trim();
    const memo = memoInput.value.trim();
    const sessionData = { title, start_time: formatTime(startTime), end_time: formatTime(endTime), duration, memo };
    studySessions.push(sessionData);
    renderStudySessions();
    startStopButton.textContent = '開始';
    startTime = null;
    titleInput.value = '';
    memoInput.value = '';
}

function calculateDuration(start, end) {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function renderStudySessions() {
    recordsBody.innerHTML = ''; // テーブルをクリア
    studySessions.forEach(session => {
        const row = recordsBody.insertRow();
        const titleCell = row.insertCell();
        const startTimeCell = row.insertCell();
        const endTimeCell = row.insertCell();
        const durationCell = row.insertCell();
        const memoCell = row.insertCell();

        titleCell.textContent = session.title;
        startTimeCell.textContent = session.start_time;
        endTimeCell.textContent = session.end_time;
        durationCell.textContent = session.duration;
        memoCell.textContent = session.memo;
    });
}

startStopButton.addEventListener('click', () => {
    if (startStopButton.textContent === '開始') {
        startTimer();
    } else {
        stopTimer();
    }
});

setInterval(updateTime, 1000); // 1秒ごとに時間を更新

endTimeButton.addEventListener('click', async () => {
    if (studySessions.length === 0) {
        alert('本日の勉強記録がありません。');
        return;
    }
    try {
        const response = await fetch('/end_day', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studySessions) // JavaScript側の記録を送信
        });
        const data = await response.json();
        if (data.status === 'success') {
            alert(data.message);
            // 保存成功後、画面の記録をクリア
            studySessions = [];
            renderStudySessions();
        } else {
            alert(`エラーが発生しました: ${data.message}`);
        }
    } catch (error) {
        console.error('データの送信中にエラーが発生しました:', error);
        alert('データの送信中にエラーが発生しました。');
    }
});

