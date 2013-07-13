<!DOCTYPE html>
<html>
  <head>
    <title>Cron Engine</title>
    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="css/application.css" rel="stylesheet" media="screen">
  </head>
  <body>
      
    <h1>Cron Engine <small>Console</small></h1>
    
    <div class="navbar" data-bind="if: !isLogin()">
      <div class="navbar-inner">
        <ul class="nav">
          <li data-bind="css: {active: isCronJobList()}"><a href="#cronJobs">Cron Jobs</a></li>
          <li data-bind="css: {active: isSubscribers()}"><a href="#subscribers">Subscribers</a></li>
          <li><a data-bind="click:logout" href="">Logout</a></li>
        </ul>
      </div>
    </div>
    
    <div class="container-fluid forty-width centered" data-bind="if: isLogin">
      <h2>Login here</h2>

      <form class="form-horizontal">
      <div class="control-group">
        <label class="control-label" for="inputEmail">Email</label>
        <div class="controls">
          <input type="text" id="inputUsername" data-bind="value: inputUsername" placeholder="Username">
        </div>
      </div>
      <div class="control-group">
        <label class="control-label" for="inputPassword">Password</label>
        <div class="controls">
          <input type="password" id="inputPassword" data-bind="value: inputPassword" placeholder="Password">
        </div>
      </div>
      <div class="control-group">
        <div class="controls">
          <button type="submit" class="btn" data-bind="click: gotoCronJobList, disable: isBusyLoading">Sign in</button>
        </div>
      </div>
      </form>
    </div>
    
      <div class="container-fluid" data-bind="if: isCronJobList">
        <button data-bind="click: logout, disable: isBusyLoading" class="btn btn-primary float-right"><i class="icon-plus icon-white"></i> Add CronJob</button>
        <h2>Cron job list</h2>
        <table class="table table-striped table-hover table-condensed">
          <thead>
            <tr>
              <th>ID</th>
              <th>URL</th>
              <th>Headers</th>
              <th>Timeout</th>
              <th>Frequency</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody data-bind="foreach: cronJobList">
            <tr data-bind="click: $parent.gotoCronExecList" class="clickable">
                <td data-bind="text: cronJobId"></td>
                <td data-bind="text: url"></td>
                <td data-bind="text: headerList"></td>
                <td data-bind="text: timeout"></td>
                <td data-bind="text: frequency"></td>
                <td data-bind="text: tagList"></td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <div class="container-fluid" data-bind="if: isCronExecList">
        
        <div data-bind="with: currentCronJob">
          <h3>Cron Job <small data-bind="text: cronJobId"></small></h3>
          <dl class="dl-horizontal">
            <dt>url</dt>
            <dd data-bind="text: url"></dd>
            <dt>headers</dt>
            <dd><span data-bind="if:hasHeaders(), text: headerList"></span> <span data-bind="ifnot:hasHeaders()"><i>none</i></span></dd>
            <dt>timeout</dt>
            <dd data-bind="text: timeout"></dd>
            <dt>frequency</dt>
            <dd data-bind="text: frequency"></dd>
            <dt>tags</dt>
            <dd data-bind="text: tagList"></dd>
          </dl>
        </div>
        
        <h2>Executions</h2>
        <table class="table table-striped table-hover table-condensed">
          <thead>
            <tr>
              <th>ID</th>
              <th>Scheduled</th>
              <th>Started</th>
              <th>Finished</th>
              <th>Duration (sec)</th>
              <th>HttpCode / Result</th>
            </tr>
          </thead>
          <tbody data-bind="foreach: cronExecList">
            <tr data-bind="click: $parent.gotoCronExec, css: {success: isSuccessful(), error: !isSuccessful()}" class="clickable">
                <td data-bind="text: cronExecutionId"></td>
                <td data-bind="text: scheduledText"></td>
                <td data-bind="text: startedText"></td>
                <td data-bind="text: finishedText"></td>
                <td data-bind="text: duration"></td>
                <td>
                  <span data-bind="text: httpCode"></span>
                  <i data-bind="css: {'icon-ok': isSuccessful(), 'icon-remove': !isSuccessful()}"></i>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <div class="container-fluid" data-bind="if: isCronExec">
        <div data-bind="with: currentCronExec">
          <button data-bind="click: $parent.gotoCronExecList, disable: $parent.isBusyLoading" class="btn btn-primary float-right"><i class="icon-arrow-left icon-white"></i> Back</button>
          <h3>Cron Execution <small data-bind="text: cronExecutionId"></small></h3>
          <dl class="dl-horizontal">
            <dt>cron job id</dt>
            <dd data-bind="text: cronJobId"></dd>
            <dt>url</dt>
            <dd data-bind="text: url"></dd>
            <dt>headers</dt>
            <dd><span data-bind="if:hasHeaders(), text: headerList"></span> <span data-bind="ifnot:hasHeaders()"><i>none</i></span></dd>
            <dt>scheduled</dt>
            <dd data-bind="text: scheduledText"></dd>
            <dt>started</dt>
            <dd data-bind="text: startedText"></dd>
            <dt>finished</dt>
            <dd data-bind="text: finishedText"></dd>
            <dt>httpCode</dt>
            <dd data-bind="text: httpCode"></dd>
            <dt>timeout</dt>
            <dd data-bind="text: timeout"></dd>
            <dt>frequency</dt>
            <dd data-bind="text: frequency"></dd>
            <dt>tagList</dt>
            <dd data-bind="text: tagList"></dd>
            <dt>output</dt>
            <dd><span data-bind="if:hasOutput()"><code data-bind="text: output"></code></span> <span data-bind="ifnot:hasOutput()"><i>none</i></span></dd>
            <dt>error message</dt>
            <dd><span data-bind="if:hasErrorMessage(), text: errorMessage"></span> <span data-bind="ifnot:hasErrorMessage()"><i>none</i></span></dd>
          </dl>
        </div>        
      </div>
    
      <div class="container-fluid" data-bind="if: isSubscribers">
        <button data-bind="click: gotoAddSubscriber, disable: isBusyLoading" class="btn btn-primary float-right"><i class="icon-plus icon-white"></i> Add Subscriber</button>
        <h2>Subscribers list</h2>
        <table class="table table-striped table-hover table-condensed">
          <thead>
            <tr>
              <th>Email</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody data-bind="foreach: subscriberList">
            <tr>
                <td data-bind="text: email"></td>
                <td data-bind="text: tagList"></td>
                <td><a href="#" data-bind="click: $parent.deleteSubscriber"><i class="icon-trash"></i> Delete</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    
      <div class="container-fluid forty-width centered" data-bind="if: isAddSubscriber">
        
        <h2>Add Subscriber</h2>
        
        <form class="form-horizontal" data-bind="with: inputSubscriber">
          <div class="control-group">
            <label class="control-label" for="subscriberEmail">Email</label>
            <div class="controls">
              <input type="text" id="subscriberEmail" data-bind="value: email" placeholder="Email">
            </div>
          </div>
          
          <div class="control-group">
            <label class="control-label" for="tagList">Tags</label>
            <div class="controls controls-non-input">
              <span data-bind="if: isEmptyTagList"><i>none</i></span>
              <ul class="unstyled" data-bind="foreach: tagList">
                <li class="display-inline" data-bind="text: $data"></li>
              </ul>
            </div>
          </div>
          
          <div class="control-group">
            <label class="control-label" for="inputTag">&nbsp;</label>
            <div class="controls">
              <div class="input-append">
                <input class="span2" data-bind="value: inputTag" type="text">
                <button class="btn" type="button" data-bind="click: addTag, disable: $parent.isBusyLoading">Add Tag</button>
              </div>
            </div>
          </div>
          
          <div class="control-group">
            <div class="controls">
              <button type="submit" class="btn" data-bind="click: $parent.addSubscriber, enable: canSubmit">Add Subscriber</button>
            </div>
          </div>
          
        </form>
        
      </div>
    
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/knockout/2.2.0/knockout-min.js"></script>
    <script src="js/sammy-latest.min.js"></script>
    <script src="js/utils.js"></script>
    <script src="js/subscriber-service.js"></script>
    <script src="js/application.js"></script>
  </body>
</html>