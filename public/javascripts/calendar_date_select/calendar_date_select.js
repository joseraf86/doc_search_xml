// CalendarDateSelect version 1.9.0 - a small prototype based date picker
// Questions, comments, bugs? - email the Author - Tim Harper <"timseeharper@gmail.seeom".gsub("see", "c")> 
if (typeof Prototype == 'undefined') alert("CalendarDateSelect Error: Prototype could not be found. Please make sure that your application's layout includes prototype.js (e.g. <%= javascript_include_tag :defaults %>) *before* it includes calendar_date_select.js (e.g. <%= calendar_date_select_includes %>).");
if (Prototype.Version < "1.6") alert("Prototype 1.6.0 is required.  If using earlier version of prototype, please use calendar_date_select version 1.8.3");

Element.addMethods({
  purgeChildren: function(element) { $A(element.childNodes).each(function(e){$(e).remove();}); },
  build: function(element, type, options, style) {
    newElement = Element.build(type, options, style);
    element.appendChild(newElement);
    return newElement;
  }
});

Element.build = function(type, options, style)
{
  e = $(document.createElement(type));
  $H(options).each(function(pair) { eval("e." + pair.key + " = pair.value" ); });
  if (style) 
    $H(style).each(function(pair) { eval("e.style." + pair.key + " = pair.value" ); });
  return e;
};
nil=null;

Date.one_day = 24*60*60*1000;
Date.weekdays = $w("Lu Ma Mi Ju Vi Sa Do");
Date.first_day_of_week = 1;
Date.months = $w("Enero Febrero Marzo Abril Mayo Junio Julio Agosto Septiembre Octubre Noviembre Diciembre" );
Date.padded2 = function(hour) { padded2 = hour.toString(); if (parseInt(hour) < 10) padded2="0" + padded2; return padded2; }
Date.prototype.getPaddedMinutes = function() { return Date.padded2(this.getMinutes()); }
Date.prototype.getAMPMHour = function() { hour=this.getHours(); return (hour == 0) ? 12 : (hour > 12 ? hour - 12 : hour ) }
Date.prototype.getAMPM = function() { return (this.getHours() < 12) ? "AM" : "PM"; }
Date.prototype.stripTime = function() { return new Date(this.getFullYear(), this.getMonth(), this.getDate());};
Date.prototype.daysDistance = function(compare_date) { return Math.round((compare_date - this) / Date.one_day); };
Date.prototype.toFormattedString = function(include_time){
  str = Date.months[this.getMonth()] + " " + this.getDate() + ", " + this.getFullYear();
  
  if (include_time) { hour=this.getHours(); str += " " + this.getAMPMHour() + ":" + this.getPaddedMinutes() + " " + this.getAMPM() }
  return str;
}
Date.parseFormattedString = function(string) { return new Date(string);}
Math.floor_to_interval = function(n, i) { return Math.floor(n/i) * i;}
window.f_height = function() { return( [window.innerHeight ? window.innerHeight : null, document.documentElement ? document.documentElement.clientHeight : null, document.body ? document.body.clientHeight : null].select(function(x){return x>0}).first()||0); }
window.f_scrollTop = function() { return ([window.pageYOffset ? window.pageYOffset : null, document.documentElement ? document.documentElement.scrollTop : null, document.body ? document.body.scrollTop : null].select(function(x){return x>0}).first()||0 ); }

_translations = {
  "OK": "OK",
  "Now": "Ahora",
  "Today": "Hoy"
}
SelectBox = Class.create();
SelectBox.prototype = {
  initialize: function(parent_element, values, html_options, style_options) {
    this.element = $(parent_element).build("select", html_options, style_options);
    this.populate(values);
  },
  populate: function(values) {
    this.element.purgeChildren();
    that=this; $A(values).each(function(pair) { if (typeof(pair)!="object") {pair = [pair, pair]}; that.element.build("option", { value: pair[1], innerHTML: pair[0]}) });
  },
  setValue: function(value) {
    e = this.element;
    matched=false;
    $R(0, e.options.length - 1 ).each(function(i) { if(e.options[i].value==value.toString()) {e.selectedIndex = i; matched=true;}; } );
    return matched;
  },
  getValue: function() { return $F(this.element)}
}
CalendarDateSelect = Class.create();
CalendarDateSelect.prototype = {
  initialize: function(target_element, options) {
    this.target_element = $(target_element); // make sure it's an element, not a string
    if (!this.target_element) { alert("Target element " + target_element + " not found!"); return false;}
    if (down=this.target_element.down("INPUT")) this.target_element = down;
    
    this.target_element.calendar_date_select = this;
    this.last_click_at = 0;
    // initialize the date control
    this.options = $H({
      embedded: false,
      popup: nil,
      time: false,
      buttons: true,
      year_range: 10,
      calendar_div: nil,
      close_on_click: nil,
      minute_interval: 5,
      popup_by: this.target_element,
      month_year: "dropdowns",
      onchange: this.target_element.onchange
    }).merge(options || {});
    
    this.selection_made = $F(this.target_element).strip()!=="";
    this.use_time = this.options.get("time");
    
    this.callback("before_show")
    this.calendar_div = $(this.options.get("calendar_div"));
    
    this.parseDate();
    
    // by default, stick it by the target element (if embedded, that's where we'll want it to show up)
    if (this.calendar_div == nil) { this.calendar_div = $( this.options.get("embedded") ? this.target_element.parentNode : document.body ).build('div'); }
    if (!this.options.get("embedded")) this.calendar_div.setStyle( { position:"absolute", visibility: "hidden", left:0, top:0 } )
    
    this.calendar_div.addClassName("calendar_date_select");
    
    if (this.options.get("embedded")) this.options.set("close_on_click", false);
    // logic for close on click
    if (this.options.get("close_on_click")===nil )
    {
      if (this.options.get("time"))
        this.options.set("close_on_click", false);
      else
        this.options.set("close_on_click", true);
    }
    
    // set the click handler to check if a user has clicked away from the document
    if(!this.options.get("embedded")) {
      Event.observe(document, "mousedown", this.closeIfClickedOut_handler=this.closeIfClickedOut.bindAsEventListener(this));
      Event.observe(document, "keypress", this.keyPress_handler=this.keyPress.bindAsEventListener(this));
    }
    
    this.init();
    if(!this.options.get("embedded")) { this.positionCalendarDiv() };
    this.callback("after_show")
  },
  positionCalendarDiv: function() {
    above=false;
    c_pos = Position.cumulativeOffset(this.calendar_div); c_left = c_pos[0]; c_top = c_pos[1]; c_dim = this.calendar_div.getDimensions(); c_height = c_dim.height; c_width = c_dim.width; 
    w_top = window.f_scrollTop(); w_height = window.f_height();
    e_dim = Position.cumulativeOffset($(this.options.get("popup_by"))); e_top = e_dim[1]; e_left = e_dim[0]; e_height = $(this.options.get("popup_by")).getDimensions().height; e_bottom = e_top + e_height;
    
    if ( (( e_bottom + c_height ) > (w_top + w_height)) && ( e_bottom - c_height > w_top )) above=true;
    left_px = e_left.toString() + "px";
    top_px = (above ? (e_top - c_height ) : ( e_top + e_height )).toString() + "px";
    
    this.calendar_div.style.left = left_px;  this.calendar_div.style.top = top_px;
    
    this.calendar_div.setStyle({visibility:""});
    
    // draw an iframe behind the calendar -- ugly hack to make IE 6 happy
    if(navigator.appName=="Microsoft Internet Explorer") this.iframe = $(document.body).build("iframe", {className: "ie6_blocker"}, { left: left_px, top: top_px, height: c_height.toString()+"px", width: c_width.toString()+"px", border: "0px"})
  },
  init: function() {
    that=this;
    // create the divs
    $w("top header body buttons footer bottom").each(function(name) {
      eval(name + "_div = that." + name + "_div = that.calendar_div.build('div', { className: 'cds_"+name+"' }, { clear: 'left'} ); ");
    });
    
    this.initHeaderDiv();
    this.initButtonsDiv();
    this.initCalendarGrid();
    this.updateFooter("&nbsp;");
    
    this.refresh();
    this.setUseTime(this.use_time);
  },
  initHeaderDiv: function() {
    header_div = this.header_div;
    this.close_button = header_div.build("a", { innerHTML: "x", href:"#", onclick:function () { this.close(); return false; }.bindAsEventListener(this), className: "close" });
    this.next_month_button = header_div.build("a", { innerHTML: "&gt;", href:"#", onclick:function () { this.navMonth(this.date.getMonth() + 1 ); return false; }.bindAsEventListener(this), className: "next" });
    this.prev_month_button = header_div.build("a", { innerHTML: "&lt;", href:"#", onclick:function () { this.navMonth(this.date.getMonth() - 1 ); return false; }.bindAsEventListener(this), className: "prev" });
    
    if (this.options.get("month_year")=="dropdowns") {
      this.month_select = new SelectBox(header_div, $R(0,11).map(function(m){return [Date.months[m], m]}), {className: "month", onchange: function () { this.navMonth(this.month_select.getValue()) }.bindAsEventListener(this)}); 
      this.year_select = new SelectBox(header_div, [], {className: "year", onchange: function () { this.navYear(this.year_select.getValue()) }.bindAsEventListener(this)}); 
      this.populateYearRange();
    } else {
      this.month_year_label = header_div.build("span")
    }
  },
  initCalendarGrid: function() {
    body_div = this.body_div;
    this.calendar_day_grid = [];
    days_table = body_div.build("table", { cellPadding: "0px", cellSpacing: "0px", width: "100%" })
    // make the weekdays!
    weekdays_row = days_table.build("thead").build("tr");
    Date.weekdays.each( function(weekday) { 
      weekdays_row.build("th", {innerHTML: weekday});
    });
    
    days_tbody = days_table.build("tbody")
    // Make the days!
    row_number=0
    for(cell_index=0; cell_index<42; cell_index++)
    {
      weekday=(cell_index+Date.first_day_of_week ) % 7;
      if ( cell_index % 7==0 ) days_row = days_tbody.build("tr", {className: 'row_'+row_number++});
      (this.calendar_day_grid[cell_index] = days_row.build("td", {
          calendar_date_select: this,
          onmouseover: function () { this.calendar_date_select.dayHover(this); },
          onmouseout: function () { this.calendar_date_select.dayHoverOut(this) },
          onclick: function() { this.calendar_date_select.updateSelectedDate(this, true); },
          className: (weekday==0) || (weekday==6) ? " weekend" : "" //clear the class
        },
        { cursor: "pointer" }
      )).build("div");
      this.calendar_day_grid[cell_index];
    }
  },
  initButtonsDiv: function()
  {
    buttons_div = this.buttons_div;
    if (this.options.get("time"))
    {
      blank_time = $A(this.options.get("time")=="mixed" ? [[" - ", ""]] : []);
      buttons_div.build("span", {innerHTML:"@", className: "at_sign"});
      
      t=new Date();
      this.hour_select = new SelectBox(buttons_div,
        blank_time.concat($R(0,23).map(function(x) {t.setHours(x); return $A([t.getAMPMHour()+ " " + t.getAMPM(),x])} )),
        { 
          calendar_date_select: this, 
          onchange: function() { this.calendar_date_select.updateSelectedDate( { hour: this.value });},
          className: "hour" 
        }
      );
      buttons_div.build("span", {innerHTML:":", className: "seperator"});
      that=this;
      this.minute_select = new SelectBox(buttons_div,
        blank_time.concat($R(0,59).select(function(x){return (x % that.options.get('minute_interval')==0)}).map(function(x){ return $A([ Date.padded2(x), x]); } ) ),
        { 
          calendar_date_select: this, 
          onchange: function() { this.calendar_date_select.updateSelectedDate( {minute: this.value }) }, 
          className: "minute" 
        }
      );
      
    } else if (! this.options.get("buttons")) buttons_div.remove();
    
    if (this.options.get("buttons")) {
      buttons_div.build("span", {innerHTML: "&nbsp;"});
      if (this.options.get("time")=="mixed" || !this.options.get("time")) b=buttons_div.build("a", {
          innerHTML: _translations["Today"],
          href: "#",
          onclick: function() {this.today(false); return false;}.bindAsEventListener(this)
        });
      
      if (this.options.get("time")=="mixed") buttons_div.build("span", {innerHTML: " | ", className:"button_seperator"})
      
      if (this.options.get("time")) b = buttons_div.build("a", {
        innerHTML: _translations["Now"],
        href: "#",
        onclick: function() {this.today(true); return false}.bindAsEventListener(this)
      });
      
      if (!this.options.get("embedded"))
      {
        buttons_div.build("span", {innerHTML: "&nbsp;"});
        buttons_div.build("a", { innerHTML: _translations["OK"], href: "#", onclick: function() {this.close(); return false;}.bindAsEventListener(this) });
      }
    }
  },
  refresh: function ()
  {
    this.refreshMonthYear();
    this.refreshCalendarGrid();
    
    this.setSelectedClass();
    this.updateFooter();
  },
  refreshCalendarGrid: function () {
    this.beginning_date = new Date(this.date).stripTime();
    this.beginning_date.setDate(1);
    this.beginning_date.setHours(12); // Prevent daylight savings time boundaries from showing a duplicate day
    pre_days = this.beginning_date.getDay() // draw some days before the fact
    if (pre_days < 3) pre_days+=7;
    this.beginning_date.setDate(1 - pre_days + Date.first_day_of_week);
    
    iterator = new Date(this.beginning_date);
    
    today = new Date().stripTime();
    this_month = this.date.getMonth();
    for (cell_index=0;cell_index<42; cell_index++)
    {
      day = iterator.getDate(); month = iterator.getMonth();
      cell = this.calendar_day_grid[cell_index];
      Element.remove(cell.childNodes[0]); div = cell.build("div", {innerHTML:day});
      if (month!=this_month) div.className = "other";
      cell.day=day; cell.month = month; cell.year = iterator.getFullYear();
      iterator.setDate( day + 1);
    }
    
    if (this.today_cell) this.today_cell.removeClassName("today");
    
    if ( $R( 0, 42 ).include(days_until = this.beginning_date.daysDistance(today)) ) {
      this.today_cell = this.calendar_day_grid[days_until];
      this.today_cell.addClassName("today");
    }
  },
  refreshMonthYear: function() {
    m=this.date.getMonth();
    y=this.date.getFullYear();
    // set the month
    if (this.options.get("month_year") == "dropdowns") 
    {
      this.month_select.setValue(m, false);
      
      e=this.year_select.element; 
      if (this.flexibleYearRange() && (!(this.year_select.setValue(y, false)) || e.selectedIndex <= 1 || e.selectedIndex >= e.options.length - 2 )) this.populateYearRange();
      
      this.year_select.setValue(y);
      
    } else {
      this.month_year_label.update( Date.months[m] + " " + y.toString()  );
    }
  },
  populateYearRange: function() {
    this.year_select.populate(this.yearRange().toArray());
  },
  yearRange: function() {
    if (!this.flexibleYearRange())
      return $R(this.options.get("year_range")[0], this.options.get("year_range")[1]);
      
    y = this.date.getFullYear();
    return $R(y - this.options.get("year_range"), y + this.options.get("year_range"));
  },
  flexibleYearRange: function() { return (typeof(this.options.get("year_range")) == "number"); },
  validYear: function(year) { if (this.flexibleYearRange()) { return true;} else { return this.yearRange().include(year);}  },
  dayHover: function(element) {
    element.addClassName("hover");
    hover_date = new Date(this.selected_date);
    hover_date.setYear(element.year); hover_date.setMonth(element.month); hover_date.setDate(element.day);
    this.updateFooter(hover_date.toFormattedString(this.use_time));
  },
  dayHoverOut: function(element) { element.removeClassName("hover"); this.updateFooter(); },
  setSelectedClass: function() {
    if (!this.selection_made) return;
    
    // clear selection
    if (this.selected_cell) this.selected_cell.removeClassName("selected");
    
    if ($R(0,42).include( days_until = this.beginning_date.daysDistance(this.selected_date.stripTime()) )) {
      this.selected_cell = this.calendar_day_grid[days_until];
      this.selected_cell.addClassName("selected");
    }
  },
  reparse: function() { this.parseDate(); this.refresh(); },
  dateString: function() {
    return (this.selection_made) ? this.selected_date.toFormattedString(this.use_time) : "&nbsp;";
  },
  parseDate: function()
  {
    value = $F(this.target_element).strip()
    this.date = value=="" ? NaN : Date.parseFormattedString(this.options.get("date") || value);
    if (isNaN(this.date)) this.date = new Date();
    if (!this.validYear(this.date.getFullYear())) this.date.setYear( (this.date.getFullYear() < this.yearRange().start) ? this.yearRange().start : this.yearRange().end);
    this.selected_date = new Date(this.date);
    this.use_time = /[0-9]:[0-9]{2}/.exec(value) ? true : false;
    this.date.setDate(1);
  },
  updateFooter:function(text) { if (!text) text=this.dateString(); this.footer_div.purgeChildren(); this.footer_div.build("span", {innerHTML: text }); },
  updateSelectedDate:function(parts, via_click) {
    parts=$H(parts);
    if ((this.target_element.disabled || this.target_element.readOnly) && this.options.get("popup")!="force") return false;
    if (parts.get("day")) {
      this.selection_made = true;
      for (x=0; x<=1; x++) {
      this.selected_date.setDate(parts.get("day"));
      this.selected_date.setMonth(parts.get("month"));
      this.selected_date.setYear(parts.get("year"));}
    }
    
    if (!isNaN(parts.get("hour"))) this.selected_date.setHours(parts.get("hour"));
    if (!isNaN(parts.get("minute"))) this.selected_date.setMinutes( Math.floor_to_interval(parts.get("minute"), this.options.get("minute_interval")) );
    if (parts.get("hour") === "" || parts.get("minute") === "") 
      this.setUseTime(false);
    else if (!isNaN(parts.get("hour")) || !isNaN(parts.get("minute")))
      this.setUseTime(true);
    
    this.updateFooter();
    this.setSelectedClass();
    
    if (this.selection_made) this.updateValue();
    if (this.options.get("close_on_click")) { this.close(); }
    if (via_click && !this.options.get("embedded")) {
      if ((new Date() - this.last_click_at) < 333) this.close();
      this.last_click_at = new Date();
    }
  },
  navMonth: function(month) { (target_date = new Date(this.date)).setMonth(month); return (this.navTo(target_date)); },
  navYear: function(year) { (target_date = new Date(this.date)).setYear(year); return (this.navTo(target_date)); },
  navTo: function(date) {
    if (!this.validYear(date.getFullYear())) return false;
    this.date = date;
    this.date.setDate(1);
    this.refresh();
    this.callback("after_navigate", this.date);
    return true;
  },
  setUseTime: function(turn_on) {
    this.use_time = this.options.get("time") && (this.options.get("time")=="mixed" ? turn_on : true) // force use_time to true if time==true && time!="mixed"
    if (this.use_time && this.selected_date) { // only set hour/minute if a date is already selected
      minute = Math.floor_to_interval(this.selected_date.getMinutes(), this.options.get("minute_interval"));
      hour = this.selected_date.getHours();
      
      this.hour_select.setValue(hour);
      this.minute_select.setValue(minute)
    } else if (this.options.get("time")=="mixed") {
      this.hour_select.setValue(""); this.minute_select.setValue("");
    }
  },
  updateValue: function() {
    last_value = this.target_element.value;
    this.target_element.value = this.dateString();
    if (last_value!=this.target_element.value) this.callback("onchange");
  },
  today: function(now) {
    d=new Date(); this.date = new Date();
    o = $H({ day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), hour: d.getHours(), minute: d.getMinutes()});
    if ( ! now ) o = o.merge({hour: "", minute:""}); 
    this.updateSelectedDate(o, true);
    this.refresh();
  },
  close: function() {
    if (this.closed) return false;
    this.callback("before_close");
    this.target_element.calendar_date_select = nil;
    Event.stopObserving(document, "mousedown", this.closeIfClickedOut_handler);
    Event.stopObserving(document, "keypress", this.keyPress_handler);
    this.calendar_div.remove(); this.closed=true;
    if (this.iframe) this.iframe.remove();
    if (this.target_element.type!="hidden") this.target_element.focus();
    this.callback("after_close");
  },
  closeIfClickedOut: function(e) {
    if (! $(Event.element(e)).descendantOf(this.calendar_div) ) this.close();
  },
  keyPress: function(e) {
    if (e.keyCode==Event.KEY_ESC) this.close();
  },
  callback: function(name, param) { if (this.options[name]) { this.options[name].bind(this.target_element)(param); } }
}
