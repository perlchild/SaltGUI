class PageRoute extends Route {

  _updateMinions(data) {
    var minions = data.return[0];

    var list = this.getPageElement().querySelector('#minions');
    var hostnames = Object.keys(minions).sort();

    for(var i = 0; i < hostnames.length; i++) {
      var minion_info = minions[hostnames[i]];

      // minions can be offline, then the info will be false
      if (minion_info === false) {
        this._updateOfflineMinion(list, hostnames[i]);
      } else {
        var minion = minions[hostnames[i]];
        minion.hostname = hostnames[i];
        this._updateMinion(list, minion);
      }
    }
  }

  _updateOfflineMinion(container, hostname) {
    var element = document.getElementById(hostname);
    if(element == null) {
      // offline minion not found on screen...
      // construct a basic element that can be updated here
      element = document.createElement('li');
      element.id = hostname;
      container.appendChild(element);
    }
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }

    element.appendChild(Route._createDiv("hostname", hostname));

    var offline = Route._createDiv("status", "offline");
    offline.classList.add("offline");
    element.appendChild(offline);
  }

  _updateMinion(container, minion) {
    var ip = minion.fqdn_ip4;

    var element = document.getElementById(minion.hostname);
    if(element == null) {
      // online minion not found on screen...
      // construct a basic element that can be updated here
      element = document.createElement('li');
      element.id = minion.hostname;
      container.appendChild(element);
    }
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }

    element.appendChild(Route._createDiv("hostname", minion.hostname));

    var address = Route._createDiv("status", ip);
    address.classList.add("address");
    address.setAttribute("tabindex", -1);
    address.addEventListener('click', this._copyAddress);
    element.appendChild(address);

    element.appendChild(Route._createDiv("os", minion.os + " " + minion.osrelease));
  }

  _addMinion(container, hostname) {

    var element = document.getElementById(hostname);
    if(element != null) {
      // minion already on screen...
      return;
    }

    element = document.createElement('li');
    element.id = hostname;

    element.appendChild(Route._createDiv("hostname", hostname));

    var minion = Route._createDiv("status", "accepted");
    minion.classList.add("accepted");
    element.appendChild(minion);

    element.appendChild(Route._createDiv("os", "loading..."));

    container.appendChild(element);
  }

  _addNone(container) {

    var element = document.createElement('li');

    element.appendChild(Route._createDiv("hostname", "none"));

    container.appendChild(element);
  }

  _updateJobs(data) {
    var jobContainer = this.getPageElement().querySelector(".jobs");
    jobContainer.innerHTML = "";
    var jobs = this._jobsToArray(data.return[0]);
    this._sortJobs(jobs);

    //Add seven most recent jobs
    var shown = 0;
    var i = 0;
    while(shown < 7 && jobs[i] !== undefined) {
      var job = jobs[i];
      i = i + 1;
      if(job.Function === "saltutil.find_job") continue;
      if(job.Function === "grains.items") continue;
      if(job.Function === "wheel.key.list_all") continue;
      if(job.Function === "runner.jobs.list_job") continue;
      if(job.Function === "runner.jobs.list_jobs") continue;

      this._addJob(jobContainer, job);
      shown = shown + 1;
    }
    this.jobsLoaded = true;
    if(this.keysLoaded && this.jobsLoaded) this.resolvePromise();
  }

  _addJob(container, job) {
    var element = document.createElement('li');
    element.id = job.id;

    element.appendChild(Route._createDiv("function", job.Function));
    element.appendChild(Route._createDiv("target", job.Target));
    element.appendChild(Route._createDiv("time", job.StartTime));
    container.appendChild(element);
    element.addEventListener('click', this._createJobListener(job.id));
  }

  _createJobListener(id) {
    var router = this.router;
    return function() {
      router.goTo("/job?id=" + id);
    };
  }

  _jobsToArray(jobs) {
    var keys = Object.keys(jobs);
    var newArray = [];

    for(var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var job = jobs[key];
      job.id = key;
      newArray.push(job);
    }

    return newArray;
  }

  _sortJobs(jobs) {
    jobs.sort(function(a, b){
      // The id is already a integer value based on the date, let's use
      // it to sort the jobs
      if (a.id < b.id) return 1;
      if (a.id > b.id) return -1;
      return 0;
    });
  }

  _copyAddress(evt) {
    var target = evt.target;
    var selection = window.getSelection();
    var range = document.createRange();

    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
  }

  _runCommand(evt, targetString, commandString) {
    this.router.api._toggleManualRun(evt);
    var target = document.querySelector("#target");
    var command = document.querySelector("#command");
    target.value = targetString;
    command.value = commandString;
  }

  _runHighState(evt, hostname) {
    this._runCommand(evt, hostname, "state.apply");
  }

  _runAcceptKey(evt, hostname) {
    this._runCommand(evt, hostname, "salt.wheel.key.accept");
  }

  _runRejectKey(evt, hostname) {
    this._runCommand(evt, hostname, "salt.wheel.key.reject");
  }

  _runDeleteKey(evt, hostname) {
    this._runCommand(evt, hostname, "salt.wheel.key.delete");
  }
}
