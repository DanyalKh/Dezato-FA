from __future__ import unicode_literals
import frappe

from frappe.frappeclient import FrappeClient
import json


@frappe.whitelist()
def email_help(recipient, message, complaint_by, orgid, contactno):

    params = {
        "orgid": orgid,
        "source": "Call",
        "complaint_by": complaint_by,
        "email_address": recipient,
        "description": message,
        "ticket_status": "Open",
        "contactno": contactno
    }
    # "vps_account": "ACC000601"
    ret = mapping_and_save(params)

    return ret

def mapping_and_save(params):

    try:
        params = json.dumps(params)

        # connection
        method = "vat.vatapi.apis.troubleticketing.getTicketInfo"
        url = 'https://vat.skylines.ae'
        user_name = 'tt@skylines.ae'
        pswd = 'ttmaven456#'
        client = FrappeClient(url, user_name, pswd)
        res = client.post_api2(method, params)

        return res

    except Exception as ex:
        print ex
        frappe.throw("API has no response: " + ex.message)