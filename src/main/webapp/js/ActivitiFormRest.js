var ActivitiFormRest = {
	options: {},
	getTaskFormById: function(taskId, callback) {
		var url = Lang.sub(this.options.taskFormById, {taskId: taskId});
		
		$.ajax({
			url: url,
			dataType: 'json',
			cache: false,
			async: true,
			beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", Auth.getCredentials());
            },
			success: function(data, textStatus) {
				var renderedForm = data;
				if (!renderedForm) {
					console.error("Form for task '" + taskId + "' not found");
				} else {
				  callback.apply({taskId: taskId, renderedForm: renderedForm});
				}
			}
		}).done(function(data, textStatus) {
			console.log("ajax done");
		}).fail(function(jqXHR, textStatus, error){
			console.error('Get rendered form['+taskId+'] failure: ', textStatus, 'error: ', error, jqXHR);
		});
	},
	getStartFormById: function(processDefinitionId, callback) {
   		var url = Lang.sub(this.options.startFormById, {processDefinitionId: processDefinitionId});

   		$.ajax({
   			url: url,
   			dataType: 'json',
   			cache: false,
   			async: true,
   			beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", Auth.getCredentials());
            },
    		success: function(data, textStatus) {
    			var renderedForm = data;
    			if (!renderedForm) {
    				console.log("Form for process '" + processDefinitionId + "' not found");
    				// No form, so just start the process
					startProcessInstance(processDefinitionId, null, null, null);
    			} else {
    			  callback.apply({processDefinitionId: processDefinitionId, renderedForm: renderedForm});
    			}
    		}
    	}).done(function(data, textStatus) {
    		console.log("ajax done");
    	}).fail(function(jqXHR, textStatus, error){
    		console.error('Get rendered form['+processDefinitionId+'] failure: ', textStatus, 'error: ', error, jqXHR);
    	});
   	},
	submitTaskData: function(taskId, formData, callback) {
		var url = this.options.submitTaskData;
		var data = {
		  	"taskId" : taskId,
          	"properties" : []
		};

		// Iterate over formData and add to properties array
		$.each(formData, function(key, value) {
            var property = {"id": key, "value": value};
            data.properties.push(property);
        });
        
        $.ajax({
    		url: url,
    		method: "post",
    		contentType: "application/json",
    		data: JSON.stringify(data),
    		cache: false,
    		async: true,
    		beforeSend: function (xhr) {
                   xhr.setRequestHeader ("Authorization", Auth.getCredentials());
            },
    		success: function(data, textStatus) {
    			  callback.apply({taskId: taskId});
    		}
    	}).done(function(data, textStatus) {
    		console.log("ajax done");
    	}).fail(function(jqXHR, textStatus, error){
    		console.error('Failed to submit form['+taskId+'] : ', textStatus, 'error: ', error, jqXHR);
    		if(jqXHR.responseJSON != null) {
                alert(jqXHR.responseJSON.errorMessage);
            }
    	});
   	},
   	submitStartForm: function(processDefinitionId, formData, callback) {
    		var vars = [];
    		// Build variables array
    		$.each(formData, function(key, value) {
                var property = {"name": key, "value": value};
                vars.push(property);
            });

    		// Start process instance
    		startProcessInstance(processDefinitionId, null, vars, callback);
    },
   	startProcessInstance: function(processDefinitionId, businessKey, vars, callback) {

   		alert("starting process instance: " + processDefinitionId);

   		var url = this.options.submitStartForm;
        var data = {
          	"processDefinitionId" : processDefinitionId
        };

        if(vars) data.variables = vars;
        if(businessKey) data.businessKey = businessKey;

		 $.ajax({
            url: url,
            method: "post",
            contentType: "application/json",
            data: JSON.stringify(data),
            cache: false,
            async: true,
            beforeSend: function (xhr) {
                   xhr.setRequestHeader ("Authorization", Auth.getCredentials());
            },
            success: function(data, textStatus) {
            	alert("Process Instance Started!");
            	if(callback) callback.apply({processDefinitionId: processDefinitionId});
            }
         }).done(function(data, textStatus) {
            console.log("ajax done");
         }).fail(function(jqXHR, textStatus, error){
            console.error('Failed to start process['+processDefinitionId+'] : ', textStatus, 'error: ', error, jqXHR);
            if(jqXHR.responseJSON != null) {
                alert(jqXHR.responseJSON.errorMessage);
            }
         });
   	}
};

// Helper Functions //

var Lang = {
	SUBREGEX: /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g,
	UNDEFINED: 'undefined',
	isUndefined: function(o) {
		return typeof o === Lang.UNDEFINED;
	},
	sub: function(s, o) {
		return ((s.replace) ? s.replace(Lang.SUBREGEX, function(match, key) {
			return (!Lang.isUndefined(o[key])) ? o[key] : match;
		}) : s);
	}
};

var Auth = {
	CREDENTIALS: "Basic a2VybWl0Omtlcm1pdA==",
	getCredentials: function() {
		return this.CREDENTIALS;
	}
};