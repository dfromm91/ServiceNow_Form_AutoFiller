function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || !newValue) {
        return;
    }
    fillVisibleFields(0);
}

function fillVisibleFields(attempts) {
    if (attempts > 5) {
        return;
    }

    var changed = false;
    var fields = g_form.getEditableFields() || [];

    for (var i = 0; i < fields.length; i++) {
        var name = fields[i];
        var ui = g_form.getGlideUIElement(name);

        if (name === 'fill_test_data') {
            continue;
        }

        if (!g_form.isVisible(name)) {
            continue;
        }

        if (!ui) {
            continue;
        }

        var raw = g_form.getValue(name);
        if (raw !== null && raw.trim() !== '') {
            continue;
        }

        var ctrl = g_form.getControl(name);
        if (ctrl && ctrl.tagName === 'SELECT') {
            if (ctrl.options.length > 1) {
                g_form.setValue(name, ctrl.options[1].value);
                changed = true;
            }
            continue;
        }

        switch (ui.type) {
            case 'text':
            case 'textarea':
            case 'string':
                g_form.setValue(name, 'Test value');
                changed = true;
                break;

            case 'choice':
            case 'select_box':
                var sel = g_form.getControl(name);
                if (sel && sel.options.length > 1) {
                    g_form.setValue(name, sel.options[1].value);
                    changed = true;
                }
                break;

            case 'radio':
                var radios = document.getElementsByName(name);
                if (radios && radios.length) {
                    g_form.setValue(name, radios[0].value);
                    changed = true;
                }
                break;

            case 'checkbox':
                g_form.setValue(name, true);
                changed = true;
                break;

            case 'glide_date':
                var d = new Date(),
                    mm = ('0' + (d.getMonth() + 1)).slice(-2),
                    dd = ('0' + d.getDate()).slice(-2),
                    ds = d.getFullYear() + '-' + mm + '-' + dd;
                g_form.setValue(name, ds);
                changed = true;
                break;

            case 'glide_date_time':
                var ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
                g_form.setValue(name, ts);
                changed = true;
                break;

            case 'reference':
                fillReferenceField(name, function(success) {
                    fillVisibleFields(attempts + 1);
                });
                return;
        }
    }

    if (changed) {
        setTimeout(function() {
            fillVisibleFields(attempts + 1);
        }, 300);
    }
}

function fillReferenceField(varName, callback) {
    var ga = new GlideAjax('ReferenceFetcher');
    ga.addParam('sysparm_name', 'getFirstReference');
    ga.addParam('sysparm_variable', varName);
    ga.getXMLAnswer(function(answer) {
        if (!answer || answer === 'null') {
            if (callback) callback(false);
            return;
        }
        var parts = answer.split('::'),
            sysId = parts[0],
            disp = parts[1] || '';

        g_form.setValue(varName, sysId);

        var dispInput = document.getElementById('sys_display.' + varName);
        if (dispInput) {
            dispInput.value = disp;
            if (typeof dispInput.onchange === 'function') dispInput.onchange();
        }
        if (callback) callback(true);
    });
}
