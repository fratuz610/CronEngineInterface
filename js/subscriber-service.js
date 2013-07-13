/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

function SubscriberService(rootRef) {
  
  var self = this;
  var root = rootRef;
  
  // Add subscriber
  self.addSubscriberSuccessHandler = function(data) {
    root.gotoSubscriberList();
  }

  self.addSubscriberFailureHandler = function(error) {
    console.log("Error: " + error);
  }

  self.addSubscriber = function(data) {
    console.log("Data: " + ko.toJSON(data.toPojo()));

    $.ajax("https://think-edu-cron.appspot.com/api/observers", {
            type:"post",
            data: ko.toJSON(data.toPojo()),
            processData: false,
            headers: {"Authorization": root.getBasicAuthHeader()},
            success: self.addSubscriberSuccessHandler,
            failure: self.addSubscriberFailureHandler
            });

  }

  // delete subscriber
  self.deleteSubscriberSuccessHandler = function(data) {
    self.getSubscriberList();
  }

  self.deleteSubscriberFailureHandler = function(error) {
    console.log("Error: " + error);
  }

  self.deleteSubscriber = function(data) {

    $.ajax("https://think-edu-cron.appspot.com/api/observers/" + data.email, {
            type:"delete",
            processData: false,
            headers: {"Authorization": root.getBasicAuthHeader()},
            success: self.deleteSubscriberSuccessHandler,
            failure: self.deleteSubscriberFailureHandler
            });
  }
  
  // GET SUBSCRIBER LIST
    
  self.getSubscriberList = function() {
    
    root.isBusyLoading(true);

    $.ajax("https://think-edu-cron.appspot.com/api/observers", {
        headers: {"Authorization": root.getBasicAuthHeader()},
        success: self.getSubscriberListSuccessHandler,
        failure: self.getSubscriberListFailureHandler
        });
  }

  self.getSubscriberListSuccessHandler = function(data) {
    //console.log("Success: " + data);

    // updates the cronJobList
    root.subscriberList(JSON.parse(data));

    // updates the current state
    root.currentState("subscriberList");

    root.isBusyLoading(false);
  }

  self.getSubscriberListFailureHandler = function(error) {
    root.isBusyLoading(false);
  }
  
  
}