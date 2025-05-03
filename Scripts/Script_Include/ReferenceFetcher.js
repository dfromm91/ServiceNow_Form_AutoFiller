var ReferenceFetcher = Class.create();
ReferenceFetcher.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    getFirstReference: function() {
        // 1) Get the variable token passed from the client (e.g. "IO:abcdef123456")
        var varToken = this.getParameter('sysparm_variable');
        if (!varToken)
            return '';

        // 2) Strip off "IO:" prefix to get the real sys_id
        var varSysId = varToken.indexOf(':') > -1 ?
            varToken.split(':')[1] :
            varToken;

        // 3) Load the variable definition record
        var io = new GlideRecord('item_option_new');
        if (!io.get(varSysId))
            return '';

        // 4) Read its reference table and qualifier
        var tbl = io.getValue('reference');
        var qualifier = io.getValue('reference_qual') || '';

        // 5) Query the target table
        try {
            var gr = new GlideRecordSecure(tbl);
            if (qualifier)
                gr.addEncodedQuery(qualifier);
            gr.setLimit(1);
            gr.query();
            if (gr.next()) {
                return gr.getUniqueValue() + '::' + gr.getDisplayValue();
            }
        } catch (e) {
            gs.error('ReferenceFetcher error for ' + tbl + ': ' + e);
        }

        return ''; // no match or error
    },

    type: 'ReferenceFetcher'
});
