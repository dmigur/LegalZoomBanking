'use strict';

cardApp.controller('mainController', function ($scope, $timeout, cardService, $http, $q) {

    var Status = {
        Error: "Error",
        Success: "Success"
    }

    $scope.startIndex = 0;
    $scope.showNumber = 15;
    $scope.fileMessage = '';
    $scope.csvFile = null;
    $scope.cards = [];

    $scope.card = {
        bankName: '',
        cardNumber: '',
        expires: ''
    }


    $scope.isUploadDisabled = function () {
        return false;
    }


    $scope.isAddCardDisabled = function () {

        if (!$scope.settings) {
            return true;
        }

        try {
            var cardNumber = $scope.card.cardNumber.replace(/-/g, "").trim();

            if (!new RegExp($scope.settings.expiresPattern).test($scope.card.expires.trim()) || !new RegExp($scope.settings.cardNumberPattern).test(cardNumber) || !new RegExp($scope.settings.bankNamePattern).test($scope.card.bankName.trim())
            ) {
                return true;
            }

        } catch (e) {
            return true;
        }

        return false;
    }

    $scope.uploadFile = function () {

        console.log("uploading file");

        clearMessages();

        var myData = new FormData($('form')[1]);
        var fileSize = $('form')[1]['file'].files[0].size;

        if (fileSize > $scope.settings.maxFileSize) {
            return;
        }

        setWaitState(true);

        $.ajax({

            url: '/api/file',
            type: 'POST',
            data: myData,

            cache: false,
            contentType: false,
            processData: false,

            success: function (response) {

                console.log("success handler: response =" + response);

                if (response != null && response.status == Status.Success) {

                    if (response.message) {
                        $scope.statusMessage = response.message;
                    } else {
                        $scope.statusMessage = "Successfully uploaded";
                    }

                } else {

                    $scope.errorMessage = "No cards were uploaded!";

                }

                $scope.reloadCards().then(function (res) {
                    setWaitState(false);
                });


            },
            done: function (e, data) {
                console.log("done");
                console.log(data.result[0]);
                setWaitState(false);
            },
            error: function (e, data) {
                console.log("error");
                console.log(data.result[0]);
                $scope.errorMessage = "File not uploaded!";
                setWaitState(false);
            }
        });
    }

    $scope.addCardData = function () {

        console.log("card = " + $scope.card.cardNumber);

        clearMessages();

        var card = $scope.card;
        setWaitState(true);
        cardService.addCard($scope.card).then(function (result) {

            console.log("add card success");
            var res = result;

            if (res.status != Status.Success) {
                $scope.errorMessage = "Error adding card";
                if (res.message) {
                    $scope.errorMessage += ": " + res.message;
                }
            } else {
                $scope.statusMessage = "Card successfully added!";
            }

            $scope.reloadCards().then(function (res) {
                setWaitState(false);
            });

            $scope.clearCardInput();

        }, function (err) {

            setWaitState(false);
            console.log("error adsing card");
        })
    }


    $scope.isFileUploadDisabled = function () {

        var files = $('form')[1]['file'].files;

        if (files && files[0]) {
            var fileSize = files[0].size;

            if (fileSize > $scope.settings.maxFileSize) {

                $scope.fileMessage = "File size should not exceed " + $scope.settings.maxFileSize + " bytes";
                return true;
            } else {
                $scope.fileMessage = "";
            }
        }
        return ($scope.csvFile == null);
    };

    $('.cardNumber').keyup(function () {
        var foo = $(this).val().split("-").join(""); // remove hyphens
        if (foo.length > 0) {
            foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
        }
        $(this).val(foo);
    });


    $scope.getSettings = function () {

        console.log("getting settings");
        cardService.getSettings().then(function (result) {

            var settings = result;

            $scope.settings = {
                expiresPattern: '',
                cardNumberPattern: '',
                bankNamePattern: '',
                maxFileSize: ''
            };

            $scope.settings.expiresPattern = settings.expiresPattern;
            $scope.settings.cardNumberPattern = settings.cardNumberPattern;
            $scope.settings.bankNamePattern = settings.bankNamePattern;
            $scope.settings.maxFileSize = settings.maxFileSize;

        });
    };

    $scope.reloadCards = function () {

        console.log("reloading cards");
        var defer = $q.defer();
        $scope.cards = [];

        cardService.getCards().then(function (result) {

            var records = result;

            if (!records) {
                console.log("No card records found");
            }

            $scope.cards = $scope.cards.concat(records);

            if (!$scope.cards || $scope.cards.length == 0) {
                $scope.statusMessage = "No cards found";
            }

            $.each($scope.cards, function (ind, rec) {
                rec.cardNumber = rec.cardNumber.replace(/(?<=\d{4})\d{1,4}/g, "-xxxx").trim();
            })
            defer.resolve(result);

        });
        return defer.promise;
    }

    var clearMessages = function () {
        $scope.errorMessage = null;
        $scope.statusMessage = null;
    };

    $scope.isShowRecord = function (index) {
        return index >= $scope.startIndex && index < $scope.startIndex + $scope.showNumber;
    }

    $scope.onNavigateRight = function () {

        if (!$scope.cards) {
            return;
        }
        if ($scope.startIndex + $scope.showNumber >= $scope.cards.length) {
            return;
        }
        $scope.startIndex += $scope.showNumber;

        if ($scope.startIndex + $scope.showNumber >= $scope.cards.length) {

            setWaitState(true);

            $scope.reloadCards().then(function (res) {

                setWaitState(false);

                $scope.loadMoreData($scope.cards.length).then(function (result) {

                    if (result) {
                        console.log("Loaded more cards: " + result.length);
                    }

                })
            })

        }
    }

    $scope.clearCardInput = function () {

        $scope.card.bankName = '';
        $scope.card.expires = '';
        $scope.card.cardNumber = '';

    }
    $scope.onNavigateLeft = function () {

        if (!$scope.cards) {
            return;
        }

        if ($scope.startIndex == 0) {
            return;
        }

        $scope.startIndex = Math.max(0, $scope.startIndex - $scope.showNumber);
    };

    $scope.isNavigateLeft = function () {
        if (!$scope.cards) {
            return false;
        }

        return $scope.startIndex > 0;
    }

    $scope.isNavigateRight = function () {
        if (!$scope.cards) {
            return false;
        }
        return $scope.startIndex + $scope.showNumber < $scope.cards.length;
        //return true;
    }

    $scope.getFinishIndex = function () {

        if (!$scope.cards) return 0;
        if ($scope.startIndex + $scope.showNumber > $scope.cards.length) {
            return $scope.cards.length;
        }
        return $scope.startIndex + $scope.showNumber;

    }

    $scope.loadMoreData = function (startIndex) {

        console.log("loading more cards");
        var defer = $q.defer();
        cardService.getCards(startIndex).then(function (result) {

            var records = result;

            if (!records) {
                console.log("No card records found");
            }

            $scope.cards = $scope.cards.concat(records);

            if (records && records.length > 0) {
                console.log("Found " + records.length + " cards");

                $.each($scope.cards, function (ind, rec) {
                    rec.cardNumber = rec.cardNumber.replace(/(?<=\d{4})\d{1,4}/g, "-xxxx").trim();
                })
            } else {
                console.log("No more card records found");
            }


            defer.resolve(result);
        });
        return defer.promise;
    }

    var setWaitState = function (state) {

        if (state)
            $("#loading").css("display", "block");
        else
            $("#loading").css("display", "none");
    }

    $scope.getSettings();
    $scope.reloadCards();

})



