cardApp.factory('cardService', function ($resource, $http, $q) {

    var service = {};

    var urls = {
        getCards: "api/cards",
        addCard: "api/card",
        getSettings: "api/settings"
    };

    service.getCards = function (startIndex) {

        var offset = startIndex?startIndex:0;
        var url = urls.getCards;
        var defer = $q.defer();

        var response = $http({
            method: "get",
            url: url,
            params: {offset: offset},
            cache: false
        });

        response.success(function (responce) {
            defer.resolve(responce);
        }).error(function (responce) {
            defer.reject(responce);
        });

        return defer.promise;
    };

    service.addCard = function (card) {

        var url = urls.addCard;
        var defer = $q.defer();

        var response = $http({
            url: url,
            cache: false,
            method: "post",
            data: {
                cardNumber: card.cardNumber.replace(/-/g, "").trim(),
                expires: card.expires,
                bankName: card.bankName
            }
        });

        response.success(function (responce) {
            defer.resolve(responce);
        }).error(function (responce) {
            defer.reject(responce);
        });

        return defer.promise;
    };

    service.getSettings = function () {
        var url = urls.getSettings;
        var defer = $q.defer();

        var response = $http({
            method: "get",
            url: url,
            cache: false
        });

        response.success(function (responce) {
            defer.resolve(responce);
        }).error(function (responce) {
            defer.reject(responce);
        });

        return defer.promise;
    };

    return service;
});