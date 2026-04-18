import requests

def test_get_streets():
    response = requests.get('http://127.0.0.1:5000/streets')
    assert response.status_code == 200
    print('GET /streets passed')

def test_add_street():
    street = {'name': 'Rue de la Paix', 'price': 400}
    response = requests.post('http://127.0.0.1:5000/streets', json=street)
    assert response.status_code == 201
    print('POST /streets passed')

def test_reserve_street():
    response = requests.post('http://127.0.0.1:5000/streets/1/reserve')
    assert response.status_code == 200
    print('POST /streets/<id>/reserve passed')

def test_delete_street():
    response = requests.delete('http://127.0.0.1:5000/streets/1')
    assert response.status_code == 200
    print('DELETE /streets/<id> passed')

if __name__ == '__main__':
    test_get_streets()
    test_add_street()
    test_reserve_street()
    test_delete_street()