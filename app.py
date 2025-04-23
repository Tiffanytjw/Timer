from flask import Flask, render_template, request, jsonify
import csv
from datetime import datetime
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_stop', methods=['POST'])
def start_stop():
    data = request.get_json()
    action = data.get('action')
    title = data.get('title')
    memo = data.get('memo')
    timestamp = datetime.now().strftime('%H:%M:%S')

    global current_session_start_time
    global current_session_title
    global current_session_memo

    if action == 'start':
        current_session_start_time = datetime.now()
        current_session_title = title
        current_session_memo = memo
        return jsonify({'status': 'started', 'time': timestamp})
    elif action == 'stop':
        if current_session_start_time:
            end_time = datetime.now()
            duration = end_time - current_session_start_time
            session = {
                'title': current_session_title,
                'start_time': current_session_start_time.strftime('%H:%M:%S'),
                'end_time': end_time.strftime('%H:%M:%S'),
                'duration': str(duration).split('.')[0], # ミリ秒以下を削除
                'memo': current_session_memo
            }
            # ここでJavaScriptにセッションデータを返すように変更
            return jsonify({'status': 'stopped', 'time': timestamp, 'session': session})
        else:
            return jsonify({'status': 'error', 'message': '開始ボタンが押されていません。'})
    return jsonify({'status': 'error', 'message': 'Invalid action'})

@app.route('/end_day', methods=['POST'])
def end_day():
    study_data = request.get_json() # JavaScriptから送信されたデータを受け取る
    today = datetime.now().strftime('%Y%m%d')
    filename = f'study_{today}.csv'
    filepath = os.path.join('.', filename) # 現在のディレクトリに保存

    try:
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['title', 'start_time', 'end_time', 'duration', 'memo']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for session in study_data:
                writer.writerow(session)
        return jsonify({'status': 'success', 'message': f'今日の記録を {filename} に保存しました。', 'data': study_data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'保存中にエラーが発生しました: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True)
    