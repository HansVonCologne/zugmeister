var c;

function Controlls() {
    this.data = undefined;
    this.addEventListeners();
}

c = Controlls.prototype;

c.init = function () {
    this.getData();
};

c.addEventListeners = function() {
    $('#vehicles').on('change', _.bind(function() {
        this.emptySelect($('#brands'), $('#colors'));
        this.populateBrands();
        this.populateColors();
    }, this));

    $('#brands').on('change', _.bind(function() {
        this.emptySelect($('#colors'));
        this.populateColors();
    }, this));
};

c.getData = function () {
    Zugmeister.fetchData(this.dataResult.bind(this));
};

c.dataResult = function(err, data) {
    if (err) {
        this.getData();
    } else {
        this.data = data;
        this.populateSelects();
    }
};

c.getSelectedVehicle = function() {
    return this.getSelected($('#vehicles'));
};

c.getSelectedBrand = function() {
    return this.getSelected($('#brands'));
};

c.getSelectedColor = function() {
    return this.getSelected($('#colors'));
};

c.getSelected = function(select) {
    return (select.val() === 'All')
        ? undefined
        : select.val();
};

c.populateSelects = function() {
    this.populateVehicle();
    this.populateBrands();
    this.populateColors();
};

c.emptySelect = function() {
    _.map(Array.prototype.slice.call(arguments), function(select) {
        select.find('option').each(function() {
            if ($(this).val() !== 'All') {
                $(this).remove();
            }
        });
    });
};

c.populateVehicle = function() {
    this.populateSelect(this.data, 'type', $('#vehicles'));
};

c.populateBrands = function() {
    this.populateSelect(
        this.getBrandFilterdVehicle(this.data),
        'brand',
        $('#brands')
    );
};

c.populateColors = function() {
    this.populateSelect(
        this.getColorFilterdByVehicle(
            this.getColorFilterdBrand(this.data)
        ),
        'colors',
        $('#colors')
    );
};

c.populateSelect = function(data, key, select) {
    _.map(_.union(_.flatten(_.map(data, function(value) {
        return value[key];
    }))), function(option) {
        $(select)
            .append($("<option></option>")
            .attr("value",option)
            .text(option));
    });
};

c.getBrandFilterdVehicle = function(data) {
    return this.filterOnAttributeValue(data, 'type', this.getSelectedVehicle());
};

c.getColorFilterdByVehicle = function(data) {
    return this.filterOnAttributeValue(data, 'type', this.getSelectedVehicle());
};

c.getColorFilterdBrand = function(data) {
    return this.filterOnAttributeValue(data, 'brand', this.getSelectedBrand());
};

c.filterOnAttributeValue = function(data, attribute, value) {
    return _.filter(data, function(vehicle) {
        if (!value) {
            return true;
        }

        return vehicle[attribute] === value;
    });
};
