from flask import Blueprint, jsonify

crm_bp = Blueprint('crm', __name__)

@crm_bp.route('/leads', methods=['GET'])
def get_leads():
    print('GET /api/leads chamado')
    leads = [
        {
            "id": 1,
            "name": "João Silva",
            "email": "joao@email.com",
            "phone": "11999999999",
            "source": "Landing Page",
            "status": "Novo",
            "notes": "Interessado em chalés",
            "assigned_to": "Márcio"
        },
        {
            "id": 2,
            "name": "Ana Souza",
            "email": "ana@email.com",
            "phone": "11988888888",
            "source": "Indicação",
            "status": "Contato Feito",
            "notes": "Quer saber sobre suítes",
            "assigned_to": "Márcio"
        }
    ]
    return jsonify(leads), 200

@crm_bp.route('/pipeline', methods=['GET'])
def get_pipeline():
    print('GET /api/pipeline chamado')
    pipeline = {
        "stages": [
            {
                "id": 1,
                "name": "Novo",
                "leads": [
                    {"id": 1, "name": "João Silva"},
                    {"id": 2, "name": "Ana Souza"}
                ]
            },
            {
                "id": 2,
                "name": "Contato Feito",
                "leads": []
            },
            {
                "id": 3,
                "name": "Qualificado",
                "leads": []
            },
            {
                "id": 4,
                "name": "Fechado",
                "leads": []
            }
        ]
    }
    return jsonify(pipeline), 200

@crm_bp.route('/contacts', methods=['GET'])
def get_contacts():
    print('GET /api/contacts chamado')
    contacts = [
        {
            "id": 1,
            "name": "Márcio",
            "phone": "5752003168",
            "email": None,
            "company": None,
            "position": None,
            "notes": None,
            "created_at": "2025-08-26T18:10:25.312169",
            "updated_at": "2025-08-26T18:10:25.312169"
        }
    ]
    return jsonify(contacts), 200
