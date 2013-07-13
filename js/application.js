/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function CronExecution(cronExec) {
  
  var self = this;
  self.cronExecutionId = ko.observable(cronExec.cronExecutionId);
  self.cronJobId = ko.observable(cronExec.cronJobId);
  self.scheduled = ko.observable(cronExec.scheduled);
  self.started = ko.observable(cronExec.started);
  self.finished = ko.observable(cronExec.finished);
  self.httpCode = ko.observable(cronExec.httpCode);
  self.output = ko.observable(cronExec.output);
  self.errorMessage = ko.observable(cronExec.errorMessage);
  self.url = ko.observable(cronExec.url);
  self.headerList = ko.observable(cronExec.headerList);
  self.timeout = ko.observable(cronExec.timeout);
  self.frequency = ko.observable(cronExec.frequency);
  self.tagList = ko.observable(cronExec.tagList);
  
  self.hasHeaders = ko.computed(function() { return self.headerList().length > 0; });
  self.hasErrorMessage = ko.computed(function() { return self.errorMessage() != null; });
  self.hasOutput = ko.computed(function() { return self.output() != null; });
  self.scheduledText = ko.computed(function() { return utils.simpleFormatDate(self.scheduled()); });
  self.startedText = ko.computed(function() { return (self.started() == 0)?"N/A":utils.simpleFormatDate(self.started()); });
  self.finishedText = ko.computed(function() { return utils.simpleFormatDate(self.finished()); });
  
  self.duration = ko.computed(function() {
    
    var started = (self.started() == 0)?self.scheduled():self.started();
    var duration = self.finished() - started;
    return Math.ceil(duration/1000);
  });
  
  self.isSuccessful = ko.computed(function() {
    return self.httpCode() == 200;
  });
  
}

function CronJob(cronJob) {
  
  var self = this;
  self.cronJobId = ko.observable(cronJob.cronJobId);
  self.url = ko.observable(cronJob.url);
  self.headerList = ko.observable(cronJob.headerList);
  self.timeout = ko.observable(cronJob.timeout);
  self.frequency = ko.observable(cronJob.frequency);
  self.tagList = ko.observable(cronJob.tagList);
  
  self.hasHeaders = ko.computed(function() { return self.headerList().length > 0; });
  
}

function Subscriber() {
  
  var self = this;
  self.email = ko.observable();
  self.tagList = ko.observableArray();
  
  self.inputTag = ko.observable();
  
  self.addTag = function() {
    if(self.inputTag() == null)
      return;
    
    if(self.inputTag().trim() == "")
      return;
    
    self.tagList.push(self.inputTag());
    self.inputTag("");
  }
  
  self.isEmptyTagList = ko.computed(function() {
    return self.tagList().length == 0;
  })
  
  self.canSubmit = ko.computed(function() {
    
    console.log("Calling can submit");
    
    if(self.email() == null || !utils.isValidEmailAddress(self.email())) {
      console.log("Email problem");
      return false;
    }
    
    if(self.tagList().length == 0) {
      console.log("taglist problem");
      return false;
    }
      
    console.log("Returning true");
    return true;
    
  });
  
  self.toPojo = function() {
    return {"email": self.email(), "tagList": self.tagList()};
  }
  
  self.clear = function() { 
    self.email("");
    self.tagList([]);
  }
  
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    
    var self = this;
    
    self.subscriberService = new SubscriberService(self);
      
    self.inputUsername = ko.observable("admin");
    self.inputPassword = ko.observable("g!antPanda41");
    self.currentCronJob = ko.observable();
    self.currentCronExec = ko.observable();
    
    self.cronJobList = ko.observableArray();
    self.cronExecList = ko.observableArray();
    self.subscriberList = ko.observableArray();
    self.inputSubscriber = ko.observable(new Subscriber());
    
    self.isBusyLoading = ko.observable(false);
    
    self.currentState = ko.observable("login");
    
    self.logout = function() { 
      self.inputUsername(null); 
      self.inputPassword(null);
      self.gotoLogin();
    }
    
    self.gotoLogin = function() { location.hash = "login"; }
    self.gotoCronJobList = function() { location.hash = "cronJobs"; }
    self.gotoCronExecList = function(cronJob) { location.hash = "cronJobs/" + cronJob.cronJobId() + "/execs"; }
    self.gotoCronExec = function(cronExec) { location.hash = "cronJobs/" + cronExec.cronJobId() + "/execs/" + cronExec.cronExecutionId() }
    self.gotoSubscriberList = function() { location.hash = "subscribers"; }
    self.gotoAddSubscriber = function() { location.hash = "subscribers/add" }
    
    self.isLogin = ko.computed(function() { return self.currentState() == "login" });
    self.isCronJobList = ko.computed(function() { return self.currentState() == "cronJobList"; });
    self.isCronExecList = ko.computed(function() { return self.currentState() == "cronExecList"; });
    self.isSubscribers = ko.computed(function() { return self.currentState() == "subscriberList"; });
    self.isAddSubscriber = ko.computed(function() { return self.currentState() == "addSubscriber"; });
    self.isCronExec = ko.computed(function() { return self.currentState() == "cronExec"; });
    
    self.getBasicAuthHeader = function() {
      var tok = self.inputUsername() + ':' + self.inputPassword();
      return "Basic " + btoa(tok);
    };
    
    self.addSubscriber = function(data) {
      self.subscriberService.addSubscriber(data); 
      data.clear();
    }
    
    self.deleteSubscriber = function(data) { 
      self.subscriberService.deleteSubscriber(data); 
    }
    
    // GET CRON JOB
    self.getCronJob = function(id) {
      
      self.isBusyLoading(true);
      
      $.ajax("https://think-edu-cron.appspot.com/api/cronjobs/" + id, {
              headers: {"Authorization": self.getBasicAuthHeader()},
              success: self.getCronJobSuccessHandler,
              failure: self.getCronJobFailureHandler
              });
    }
    
    self.getCronJobSuccessHandler = function(data) {
      
      // updates the cronJobList
      self.currentCronJob(new CronJob(JSON.parse(data)));
      
      console.log("cronJob loaded");
          
      $.ajax("https://think-edu-cron.appspot.com/api/cronjobs/" + self.currentCronJob().cronJobId()+"/execs", {
        headers: {"Authorization": self.getBasicAuthHeader()},
        success: self.getCronExecListSuccessHandler,
        failure: self.getCronExecListFailureHandler
        });  
    }
    
    self.getCronJobFailureHandler = function(error) {
      self.isBusyLoading(false);
    }
    
    // GET CRON JOB LIST
    self.getCronJobList = function() {
      
      self.isBusyLoading(true);
      
      $.ajax("https://think-edu-cron.appspot.com/api/cronjobs", {
              headers: {"Authorization": self.getBasicAuthHeader()},
              success: self.getCronJobListSuccessHandler,
              failure: self.getCronJobListFailureHandler
              });
    }
    
    self.getCronJobListSuccessHandler = function(data) {
      
      // updates the cronJobList
      var rawCronJobList = JSON.parse(data);
      var cronJobList = [];
      
      $.each(rawCronJobList, function(index, value) {
        cronJobList.push(new CronJob(value));
      });
      
      self.cronJobList(cronJobList);
      
      // updates the current state
      self.currentState("cronJobList");
      
      console.log("cronjob list loaded");
      
      // updates the current state
      self.isBusyLoading(false);
    }
    
    self.getCronJobListFailureHandler = function(error) {
      self.isBusyLoading(false);
    }
    
    // GET CRON EXEC LIST
    self.getCronExecListSuccessHandler = function(data) {
      //console.log("Success: " + data);
      
      var rawCronExecList = JSON.parse(data);
      var cronExecList = [];
      
      $.each(rawCronExecList, function(index, value) { 
        cronExecList.push(new CronExecution(value));
      });
      
      // updates the cronJobList
      self.cronExecList(cronExecList);
      
      // updates the current state
      self.currentState("cronExecList");
      
      self.isBusyLoading(false);
    }
    
    self.getCronExecListFailureHandler = function(error) {
      self.isBusyLoading(false);
    }
    
    // GET CRON EXEC
    self.getCronExec = function(cronJobId, cronExecId) {
      
      self.isBusyLoading(true);
      
      $.ajax("https://think-edu-cron.appspot.com/api/cronjobs/" + cronJobId + "/execs/" + cronExecId, {
              headers: {"Authorization": self.getBasicAuthHeader()},
              success: self.getCronExecSuccessHandler,
              failure: self.getCronExecFailureHandler
              });
    }
    
    self.getCronExecSuccessHandler = function(data) {
      
      // updates the cronJobList
      self.currentCronExec(new CronExecution(JSON.parse(data)));
      
      // updates the current state
      self.currentState("cronExec");
      
      console.log("cronexec loaded");
      
      // updates the current state
      self.isBusyLoading(false);
    }
    
    self.getCronExecFailureHandler = function(error) {
      self.isBusyLoading(false);
    }
    
    // routing
    Sammy(function() {
        
        this.get('#login', function() {
          
          if(self.inputUsername() != null && self.inputPassword() != null) {
            self.gotoCronJobList();
          } else {
            self.currentState("login");
          }
          
        });
        
        this.get('#cronJobs', function() { self.getCronJobList(); });

        this.get('#cronJobs/:cronJobId/execs', function() { self.getCronJob(this.params.cronJobId); });
        
        this.get('#cronJobs/:cronJobId/execs/:cronExecId', function() { self.getCronExec(this.params.cronJobId, this.params.cronExecId); });
          
        this.get('#subscribers', function() { self.subscriberService.getSubscriberList(); });
          
        this.get('#subscribers/add', function() { self.currentState("addSubscriber"); });
        
        this.get('', function() { self.gotoLogin() });
        
    }).run();
    
    
    
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
