import requests

files = {
    'file': ('t_source.jpg', open('t_source.jpg', 'rb')),
}

#response = requests.get("http://localhost:5000/")
response = requests.post('http://localhost:5000/', files=files)
#print(response.content)