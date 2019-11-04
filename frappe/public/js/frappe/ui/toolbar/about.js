frappe.provide('frappe.ui.misc');
frappe.ui.misc.about = function () {
    if (!frappe.ui.misc.about_dialog) {
        var d = new frappe.ui.Dialog({title: __('Daztech')});

        $(d.body).html(repl("<div>\
		<img src='/assets/frappe/images/login-logo.png' /> \
		<p><i class='icon-globe icon-fixed-width'></i>\
			 Website: <a href='https://www.daztech.com/' target='_blank'>www.daztech.com/</a></p>\
	 	<p><i class='octicon octicon-tag icon-fixed-width'></i>\
			Sales: <a href='mailto:danyalkhan010@outlook.com' target='_blank'>danyalkhan010@outlook.com</a></p>\
		<h4></h4>\
		<div id='about-app-versions'></div>\
		</div>", frappe.app));

        frappe.ui.misc.about_dialog = d;


        frappe.ui.misc.about_dialog.on_page_show = function () {
            if (!frappe.versions) {
                frappe.call({
                    method: "frappe.utils.change_log.get_versions",
                    callback: function (r) {
                        show_versions(r.message);
                    }
                })
            }
        };

        var show_versions = function (versions) {
            var $wrap = $("#about-app-versions").empty();
            /*$.each(keys(versions).sort(), function(i, key) {
                var v = versions[key];
                $($.format('<p><b>{0}:</b> v{1}<br></p>',
                           [v.title, v.version])).appendTo($wrap);
            });
*/
            //frappe.versions = versions;
        }

    }

    frappe.ui.misc.about_dialog.show();

}

frappe.ui.misc.show_help = function() {

    		cur_dialog = new frappe.ui.Dialog({
			title: __("Help") ,
			fields: [
			    {
				"fieldtype": "Data",
				"label": __("Name"),
				"fieldname": "name",
                "read_only": 1
			    },
			    {
				"fieldtype": "Data",
				"label": __("Email"),
				"fieldname": "email",
                "read_only": 1
			    },
                {
				"fieldtype": "Data",
				"label": __("Contact No"),
				"fieldname": "contact_no",
                "reqd": 1,
                "description": "05xxxxxxxx",
                "length": 10
			    },
                {
				"fieldtype": "Small Text",
				"label": __("Type your message"),
				"fieldname": "message",
                "reqd": 1
			    },
            ],
			primary_action_label: __("Submit"),
			primary_action: function() {
			    get_help(cur_dialog);
			}
		});

        if (frappe.session.user_email != undefined){
            cur_dialog.set_value('email', frappe.session.user_email);
        }
        cur_dialog.set_value('name', frappe.session.user);

        cur_dialog.show();

}


frappe.ui.misc.vat_calculator = function () {
        var d = new frappe.ui.Dialog({title: __('VAT Calculator')});
        frappe.call({
            method: "frappe.client.get",
            args: {
                doctype: "User",
                name: frappe.session.user
            },
            callback(r) {
                if (r.message.language === "ar") {
                    $(d.body).html(repl("<input type='radio' name='inclusive' checked='' id='inclusive_tax' value='inclusive' onclick='inclusive();' style='margin-left: 5px;'>الضريبة الشاملة &nbsp;&nbsp;&nbsp;<input type='radio' name='exclusive' value='exclusive' id='exclusive_tax' onclick='exclusive();' style='margin-left: 5px;'>الضريبة الحصرية<div id='inclusive_tax_id'><h1 style='text-align: center'><u>الضريبة الشاملة</u></h1><br><div style='border: 2px dotted'><p><label style='margin-left: 10%;'>معدل الضريبة</label><input  id=\"get_taxes\" type=\"number\"  onchange=\"inclusive_tax_Calculation()\" style='margin-left: 20%;float: left;text-align: right;background-color: #FBC4B8;border: 1px solid;border-radius: 3px;' value='5'></p><br><p><label style='margin-left: 10%;'>كمية الشبكة</label><input id=\"amt\" type=\"number\" value=\"0\" onchange=\"inclusive_tax_Calculation()\" style='margin-left: 20%;float: left;text-align: right;background-color: #DAF7A6;border: 1px solid;border-radius: 3px;'></p><br>" +
                        "<p><label style='margin-left: 10%;'>قيمة الضريبة</label><input id=\"vat\" type=\"text\" value=\"0\" readonly=\"\" style='margin-left: 20%;float: left;text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px;'></p><br><p><label style='margin-left: 10%;'>المبلغ بدون ضريبة القيمة المضافة</label><input type=\"text\" id=\"rest\" value=\"0\" readonly=\"\" style='text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px; float: left; margin-left: 20%; '></p> " +
                        "<hr><p style='margin-left: 75%;'><button onclick=\"javascript:inclusive_tax_Calculation();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #45be4e; color: white;\" type=\"button\"><strong>حساب</strong></button>\n" +
                        "<button onclick=\"javascript:clear_all();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #ff515b; color: white;\" type=\"button\"><strong>واضح</strong></button></p></div></div><div id='exculsive_tax_id' style='display: none;'><h1 style='text-align: center'><u>الضريبة الحصرية</u></h1><br><div style='border: 2px dotted'><p><label style='margin-left: 10%;'>معدل الضريبة</label><input  id=\"get_taxes_amount\" type=\"number\"  onchange=\"exclusive_tax_Calculation()\" style='margin-left: 19%;float: left;text-align: right;background-color: #FBC4B8;border: 1px solid;border-radius: 3px;' value='5'></p><br><p><label style='margin-left: 10%;'>المبلغ بدون ضريبة القيمة المضافة</label><input id=\"amount_with_vat\" type=\"number\" value=\"0\" onchange=\"exclusive_tax_Calculation()\" style='margin-left: 19%;text-align: right;background-color: #DAF7A6;border: 1px solid;border-radius: 3px; float: left;'></p><br>" +
                        "<p><label style='margin-left: 10%;'>قيمة الضريبة</label><input id=\"vat_tax\" type=\"text\" value=\"0\" readonly=\"\" style='margin-left: 19%;float: left;text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px;'></p><br><p><label style='margin-left: 10%;'>كمية الشبكة</label><input type=\"text\" id=\"net_amount\" value=\"0\" readonly=\"\" style='margin-left: 19%;float: left;text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px;'></p> " +
                        "<hr><p style='margin-left: 75%;'><button onclick=\"javascript:exclusive_tax_Calculation();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #45be4e; color: white;\" type=\"button\"><strong>حساب</strong></button>\n" +
                        "<button onclick=\"javascript:clear_all();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #ff515b; color: white;\" type=\"button\"><strong>واضح</strong></button></p></div></div>", frappe.app));
                }
            }
        })

        $(d.body).html(repl("<input type='radio' name='inclusive' checked='' id='inclusive_tax' value='inclusive' onclick='inclusive();' style='margin-right: 5px;'>Inclusive Tax &nbsp;&nbsp;&nbsp;<input type='radio' name='exclusive' value='exclusive' id='exclusive_tax' onclick='exclusive();' style='margin-right: 5px;'>Exclusive Tax<div id='inclusive_tax_id'><h1 style='text-align: center'><u>Inclusive Tax</u></h1><br><div style='border: 2px dotted'><p><label style='margin-left: 10%;'>TAX Rate</label><input  id=\"get_taxes\" type=\"number\"  onchange=\"inclusive_tax_Calculation()\" style='margin-left: 35%;text-align: right;background-color: #FBC4B8;border: 1px solid;border-radius: 3px;' value='5'></p><br><p><label style='margin-left: 10%;'>Net Amount</label><input id=\"amt\" type=\"number\" value=\"0\" onchange=\"inclusive_tax_Calculation()\" style='margin-left: 31.5%;text-align: right;background-color: #DAF7A6;border: 1px solid;border-radius: 3px;'></p><br>" +
            "<p><label style='margin-left: 10%;'>VAT Amount</label><input id=\"vat\" type=\"text\" value=\"0\" readonly=\"\" style='margin-left: 31%;text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px;'></p><br><p><label style='margin-left: 10%;'>Amount without VAT</label><input type=\"text\" id=\"rest\" value=\"0\" readonly=\"\" style='margin-left: 21%;text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px;'></p> " +
            "<hr><p style='margin-left: 75%;'><button onclick=\"javascript:inclusive_tax_Calculation();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #45be4e; color: white;\" type=\"button\"><strong>Calculate</strong></button>\n" +
            "<button onclick=\"javascript:clear_all();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #ff515b; color: white;\" type=\"button\"><strong>Clear</strong></button></p></div></div><div id='exculsive_tax_id' style='display: none;'><h1 style='text-align: center'><u>Exclusive Tax</u></h1><br><div style='border: 2px dotted'><p><label style='margin-left: 10%;'>TAX Rate</label><input  id=\"get_taxes_amount\" type=\"number\"  onchange=\"exclusive_tax_Calculation()\" style='margin-left: 35%;text-align: right;background-color: #FBC4B8;border: 1px solid;border-radius: 3px;' value='5'></p><br><p><label style='margin-left: 10%;'>Amount without VAT</label><input id=\"amount_with_vat\" type=\"number\" value=\"0\" onchange=\"exclusive_tax_Calculation()\" style='margin-left: 21%;text-align: right;background-color: #DAF7A6;border: 1px solid;border-radius: 3px;'></p><br>" +
            "<p><label style='margin-left: 10%;'>VAT Amount</label><input id=\"vat_tax\" type=\"text\" value=\"0\" readonly=\"\" style='margin-left: 31%;text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px;'></p><br><p><label style='margin-left: 10%;'>Net Amount</label><input type=\"text\" id=\"net_amount\" value=\"0\" readonly=\"\" style='margin-left: 31.5%;text-align: right;background-color: #e8e8e8;border: 1px solid;border-radius: 3px;'></p> " +
            "<hr><p style='margin-left: 75%;'><button onclick=\"javascript:exclusive_tax_Calculation();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #45be4e; color: white;\" type=\"button\"><strong>Calculate</strong></button>\n" +
            "<button onclick=\"javascript:clear_all();\" class='btn btn-default btn-sm btn-modal-close' style=\"background-color: #ff515b; color: white;\" type=\"button\"><strong>Clear</strong></button></p></div></div>", frappe.app));


    d.show();

}

function get_help(cur_dialog){
    var contactno = cur_dialog.get_value('contact_no');
    var regEx = "05+[0-9]{8}";
    if (!contactno.match(regEx)) {
        frappe.throw("Kindly enter correct contact number")
    }
    var email = cur_dialog.get_value('email');
    var message = cur_dialog.get_value('message');
    var org = new URL(window.location.href).host;
    org = org.split('.')[0];
    cur_dialog.hide();
    frappe.call({
        method: "frappe.utils.get_help.email_help",
        args: {
            recipient: email,
            message: message,
            complaint_by: frappe.session.user,
            orgid: org,
            contactno: contactno
        },
        callback(r){
            // frappe.msgprint("We've received your request, Your ticket number is "+ r.message)
            frappe.msgprint(r.message)
        }
    })
}

function inclusive() {
    document.getElementById("inclusive_tax").checked = true;
    document.getElementById("exclusive_tax").checked = false;
    document.getElementById("inclusive_tax_id").style.display = "block";
    document.getElementById("exculsive_tax_id").style.display = "none";
}

function exclusive() {
    document.getElementById("inclusive_tax").checked = false;
    document.getElementById("exclusive_tax").checked = true;
    document.getElementById("inclusive_tax_id").style.display = "none";
    document.getElementById("exculsive_tax_id").style.display = "block";
}


function inclusive_tax_Calculation() {
    var tax_rate = document.getElementById("get_taxes").value;
    var a = document.getElementById("amt").value;
    var d = document.getElementById("vat");
    var res = document.getElementById("rest");
    var tax_val = (tax_rate / 100) + 1;
    // alert(tax_val);

    if (a == "") {
        alert("please enter");

    }
// else if (isNaN(a)) && (isNaN(tax_rate))
    else if ((isNaN(a)) && (isNaN(tax_rate))) {
        alert("Only numbers allowed");
    }


    else {

        var z = a / tax_val;
        var s = z.toFixed(2);
        res.value = s;
        var k = a - z;
        var m = k.toFixed(2);
        d.value = m;

    }
}


function exclusive_tax_Calculation() {
    var tax_rate = document.getElementById("get_taxes_amount").value;
    var a = document.getElementById("amount_with_vat").value;
    var d = document.getElementById("vat_tax");
    var res = document.getElementById("net_amount");
    var tax_val = (tax_rate / 100) + 1;
    // alert(tax_val);

    if (a == "") {
        alert("please enter");

    }
// else if (isNaN(a)) && (isNaN(tax_rate))
    else if ((isNaN(a)) && (isNaN(tax_rate))) {
        alert("Only numbers allowed");
    }


    else {

        var z = a * tax_val;
        var s = z.toFixed(2);
        res.value = s;
        var k = parseFloat(z) - parseFloat(a);
        var m = k.toFixed(2);
        d.value = m;

    }
}


function clear_all() {
    amt.value = 0;
    amount_with_vat.value = 0;
    rest.value = 0;
    vat_tax.value = 0;
    vat.value = 0;
    document.getElementById("net_amount").value = 0;

}