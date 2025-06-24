curl --location 'https://app.eraser.io/api/render/elements' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer xxxx' \
--data '{
    "theme": "dark",
    "background": true,
    "elements": [
        {
            "type": "diagram",
            "diagramType": "sequence-diagram",
            "code": "Client [icon: monitor, color: gray]\nServer [icon: server, color: blue]\nService [icon: tool, color: green]\n\nClient > Server: Data request\nactivate Server\nServer <> Service: Service request\n\nloop [label: until success, color: green] {\n  Service > Service: Check availability\n}\n\nServer - Service: Data processing\nServer --> Client: Data response\ndeactivate Server"
        }
    ]
}'