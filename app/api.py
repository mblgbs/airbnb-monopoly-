from flask import Flask, jsonify, request
import requests  # Pour les appels aux services externes

app = Flask(__name__)

# Mock database for Monopoly streets
streets = []

# URL des services externes
BANK_SERVICE_URL = "http://localhost:5001"  # Exemple : service de banque
SAVE_SERVICE_URL = "http://localhost:5002"  # Exemple : service de sauvegarde

# Route to get all streets
@app.route('/streets', methods=['GET'])
def get_streets():
    return jsonify(streets)

# Route to add a new street with integration to the save service
@app.route('/streets', methods=['POST'])
def add_street():
    data = request.get_json()
    street = {
        'id': len(streets) + 1,
        'name': data['name'],
        'price': data['price'],
        'is_reserved': False
    }
    streets.append(street)

    # Appel au service de sauvegarde
    try:
        response = requests.post(f"{SAVE_SERVICE_URL}/save", json=street)
        response.raise_for_status()
    except requests.RequestException as e:
        return jsonify({'error': 'Failed to save street', 'details': str(e)}), 500

    return jsonify(street), 201

# Route to reserve a street with integration to the bank service
@app.route('/streets/<int:street_id>/reserve', methods=['POST'])
def reserve_street(street_id):
    for street in streets:
        if street['id'] == street_id:
            if not street['is_reserved']:
                street['is_reserved'] = True

                # Appel au service de banque pour débiter le joueur
                try:
                    response = requests.post(f"{BANK_SERVICE_URL}/transactions", json={
                        'street_id': street_id,
                        'amount': street['price'],
                        'action': 'reserve'
                    })
                    response.raise_for_status()
                except requests.RequestException as e:
                    return jsonify({'error': 'Failed to process payment', 'details': str(e)}), 500

                return jsonify(street)
            else:
                return jsonify({'error': 'Street already reserved'}), 400
    return jsonify({'error': 'Street not found'}), 404

# Route to delete a street
@app.route('/streets/<int:street_id>', methods=['DELETE'])
def delete_street(street_id):
    global streets
    streets = [street for street in streets if street['id'] != street_id]
    return jsonify({'message': 'Street deleted'})

if __name__ == '__main__':
    app.run(debug=True)