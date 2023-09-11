from flask import Flask, jsonify, request
import sqlite3

# Create the Flask application
app = Flask(__name__)

# Database setup
DATABASE = 'tasks.db'

def create_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed BOOLEAN
        )
    ''')
    conn.commit()
    conn.close()

create_database()

# API
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    # Implement logic to retrieve and return all tasks as JSON
    # For now, let's return a sample list of tasks
    tasks = [{'id': 1, 'text': 'Sample Task 1', 'completed': False},
             {'id': 2, 'text': 'Sample Task 2', 'completed': True}]
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    text = data.get('text')
    if text is not None:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO tasks (text, completed) VALUES (?, ?)', (text, False))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Task created successfully'}), 201
    return jsonify({'error': 'Invalid request'}), 400

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    text = data.get('text')
    completed = data.get('completed')
    if text is not None or completed is not None:
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        cursor.execute('UPDATE tasks SET text = ?, completed = ? WHERE id = ?', (text, completed, task_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Task updated successfully'})
    return jsonify({'error': 'Invalid request'}), 400

@app.route('/', methods=['GET'])
def welcome():
    return "Welcome to the Todo List API!"

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)