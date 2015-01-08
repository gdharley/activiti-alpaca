$(document).ready(function() {

//	Alpaca.logLevel = Alpaca.DEBUG;

	/**
    * Register the button handlers
    **/
    var postRenderCallback = function(control) {
        control.form.getButtonEl("complete").click(function() {
            var value = control.getValue();
            ActivitiFormRest.submitTaskData(taskId, value, _submitCallback);
        });
        control.form.getButtonEl("close").click(function() {
        	// This needs to call a parent function to close the window.
            alert("Ain't gonna do it");
        });
    };

    var _submitCallback = function() {};

    /**
     * Render the form.
     *
     * We call alpaca() with the data, schema, options and view to tell Alpaca to render into the selected dom element(s).
     * postRender is registered separately (above) in order to format the post to Activiti
     **/
   	var _renderForm = function() {
        $("#form").alpaca({
            "data": this.renderedForm.data,
            "schema": this.renderedForm.schema,
            "options": this.renderedForm.options,
            "view": this.renderedForm.view,
            "postRender": postRenderCallback
        });
    };

    /** Test to determine if we have creds stored in localstore.
    * If we have credentials then move straight to retrieving the form for this task.
    * Otherwise, prompt for credentials and save in store.



    /** Retrieve the form referenced by the task and hand back to Alpaca for rendering **/
    ActivitiFormRest.getTaskFormById(taskId, _renderForm);

});