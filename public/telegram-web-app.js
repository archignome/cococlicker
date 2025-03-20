
// Script stub for Telegram WebApp integration
// This file is used for development outside Telegram
(function() {
  if (!window.Telegram) {
    window.Telegram = {
      WebApp: {
        initData: "",
        initDataUnsafe: {
          query_id: "dev_query_id",
          user: {
            id: 12345678,
            first_name: "Dev",
            last_name: "User",
            username: "devuser",
            language_code: "en"
          },
          auth_date: String(Math.floor(Date.now() / 1000)),
          hash: "dev_hash"
        },
        ready: function() {
          console.log("Telegram WebApp ready called");
        },
        expand: function() {
          console.log("Telegram WebApp expand called");
        },
        close: function() {
          console.log("Telegram WebApp close called");
        },
        isExpanded: true
      }
    };
  }
})();
