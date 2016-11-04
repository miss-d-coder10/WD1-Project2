"use strict";

gigcity.formContainerObject = "\n    <form id=\"event-selector\">\n      <div class=\"queryElems\">\n        <select class=\"formInput\" name=\"date\" placeholder=\"When\">\n          <option selected=\"selected\">Anytime</option>\n          <option type=\"date\">Today</option>\n          <option>Tomorrow</option>\n          <option>Next 7 days</option>\n          <option>Next 14 days</option>\n          <option>Next 1 Month</option>\n\n        Address: <input class=\"formInput\" id=\"pac-input\" name=\"location\" type=\"text\" placeholder=\"Location\">\n        <img src=\"/assets/images/currentLocation.png\" class=\"locationButton\" alt=\"currentLocation\" />\n\n        <input class=\"formInput\" type=\"number\" name=\"radius\" class=\"radius\" placeholder=\"radius\" value=\"5\">\n\n        <select class=\"formInput\" type=\"text\" name=\"eventcode\" placeholder=\"Category\">\n          <option selected=\"selected\" value=\"LIVE\">Gigs</option>\n          <option value=\"FEST\">Festivals</option>\n          <option value=\"CLUB\">Clubbing</option>\n          <option value=\"DATE\">Dating</option>\n          <option value=\"THEATRE\">Theatre</option>\n          <option value=\"COMEDY\">Comedy</option>\n          <option value=\"EXHIB\">Exhibitions</option>\n          <option value=\"KIDS\">Kids and Family</option>\n          <option value=\"BARPUB\">Pubs and Bars</option>\n          <option value=\"LGB\">LGBT</option>\n          <option value=\"SPORT\">Sport</option>\n          <option value=\"ART\">Arts</option>\n        </select>\n      </div>\n      <div class=\"submit-elems\">\n        <button type=\"submit\">Search</button>\n      </div>\n    </form>\n  ";