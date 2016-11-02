giggity.formContainerObject = `
    <form id="event-selector">
      <div class="queryElems">
        <select class="formInput" name="date" placeholder="When">
          <option selected="selected" disabled="disabled">Anytime</option>
          <option type="date">Today</option>
          <option>Tomorrow</option>
          <option>Next 7 days</option>
          <option>Next 14 days</option>
          <option>Next 1 Month</option>

        <input class="formInput" id="pac-input" name="location" type="text" placeholder="Location">

        <img src="/assets/images/currentLocation.png" class="locationButton" alt="currentLocation" />
        <input class="formInput" type="number" name="radius" class="radius" placeholder="radius">

        <select class="formInput" type="text" name="eventcode" placeholder="Category">
          <option value="FEST">Festivals</option>
          <option value="LIVE">Gigs</option>
          <option value="CLUB">Clubbing</option>
          <option value="DATE">Dating</option>
          <option value="THEATRE">Theatre</option>
          <option value="COMEDY">Comedy</option>
          <option value="EXHIB">Exhibitions</option>
          <option value="KIDS">Kids and Family</option>
          <option value="BARPUB">Pubs and Bars</option>
          <option value="LGB">LGBT</option>
          <option value="SPORT">Sport</option>
          <option value="ART">Arts</option>
        </select>
      </div>
      <div class="submit-elems">
        <button type="submit">Search</button>
      </div>
    </form>
  `;
