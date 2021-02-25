{ // Anonymous namespace
  

  /* ---- State ------------------------------------------------------------------ */
  let digitalVersion = false; //
  let attempts = 0;
  let attemptmode = "patrol";
  const notificationVideoYoutubeURL = "https://youtu.be/Y6ljFaKRTrI?t=6";


 
  /* Unused */
  let deliveryInfo = {
    adress: "Fakegatenavn 3",
    city: "Bergen",
    email: "ola.nordmann@gmail.com",
    firstName: "Ola",
    lastName: "Nordmann",
    phone: "+4799999999",
    postalCode: "5020",
  };

  const productIds = {
    elkjop: {disk: "220276", digital: "220280"},
    power: {disk: "1077687", digital: "1101680"},
    net: {disk: "1012886", digital: "1013477"},
  }

  /* ---- Utility ---------------------------------------------------------------- */

  const sleep = m => new Promise(r => setTimeout(r, m))
  const DomParser =  new DOMParser();


  /* ---- Init ------------------------------------------------------------------ */

  createGUI();
  startAttempts();

  /* ---------------------------------------------------------------------------- */
  function createGUI() {

    const container = document.createElement("div");
    container.classList.add("bot-panel-container", "fade-in");
    container.innerHTML = `
    <div class="bot-frame-content">
      <div class="bot-menu">
        
        <button class="bot-menu-btn" id="bot-attempt-txt"></button>
        <button class="bot-menu-btn" id="bot-latency-txt"></button>
      </div>
    <div class="bot-option-menu">
      <form class="bot-form">
        <label class="bot-label"><input class="bot-input" type="radio"name="botspeed"value="s"checked><span class = "bot-span">Slow</span></label>
        <label class="bot-label"><input class="bot-input" type="radio"name="botspeed"value="m"><span class = "bot-span">Random</span></label>
        <label class="bot-label"><input class="bot-input" type="radio"name="botspeed"value="f"><span class = "bot-span">Fast</span></label>
      </form>

      <form class="bot-form">
        <label class="bot-label"><input class="bot-input" type="radio"name="konsolltype"value="digital"><span class = "bot-span">Digital</span></label>
        <label class="bot-label"><input class="bot-input" type="radio"name="konsolltype"value="disk"checked><span class = "bot-span">Disk</span></label>
      </form>
    </div>
    </div>`;

    const speed_option_radio_buttons = container.querySelectorAll("input[name='botspeed']")
    const console_type_option_buttons = container.querySelectorAll("input[name='konsolltype']")
    

    speed_option_radio_buttons.forEach(el => {
      el.onclick = (e) => {
        attemptmode = e.target.value;
      };
    })

    console_type_option_buttons.forEach(el => {
      el.onclick = (e) => {
        const value = e.target.value;
        digitalVersion = value === "digital" ? true : false;
      };
    })

    document.body.appendChild(container);

  }

  async function startAttempts() {

    if(sessionStorage.getItem("playStationAddedToCart")) return;

    const startTimer = (new Date()).getTime();
    const isAddedToCart = await addToCart();
    const endTimer = (new Date()).getTime();

    updateAttempts();
    updateServerResponseTime((endTimer - startTimer) + " ms");

    if(isAddedToCart) {
      sessionStorage.setItem('playStationAddedToCart', 'true');
      notifyUserOfSuccess();
    }

    else {
      await sleep(getAttemptFrequency());
      startAttempts();
    }


  }
  

  /* add to cart "router" - returns true if success */
  async function addToCart() {

    switch(window.location.hostname) {

      /* Power */
      case "www.power.no":
        const productId = digitalVersion ? productIds.power.digital : productIds.power.disk
        return await isInStockPower(productId) ? await addToCartPower(productId) : false

      /* Elkjøp */
      case "www.elkjop.no":
        return await addToCartElkjop(digitalVersion ? productIds.elkjop.digital : productIds.elkjop.disk)

      /* NetOnNet */
      case "www.netonnet.no":
        return await addToCartNetonNet(digitalVersion ? productIds.elkjop.digital : productIds.elkjop.disk);

    }

  }

  function getAttemptFrequency() {


    if(attemptmode ==="s") {
      return 3000;
    }

    if(attemptmode === "m") {
      return (Math.random() * 2100) + 150
    }
    
    else if(attemptmode === "f") {
      return 160;
    }

    else {
      return 3000;
    }

    
  }

  function notifyUserOfSuccess(){
    window.open(notificationVideoYoutubeURL);

    window.focus();

  }

  function updateAttempts() {
    attempts += 1;
    let counter = document.querySelector("#bot-attempt-txt");
    //counter.style.animationPlayState = "initial";
    counter.innerText = attempts;
  }

  function updateServerResponseTime(latency) {
    let counter = document.querySelector("#bot-latency-txt");
    counter.innerText = latency;
  }


  /* ---- API calls ---------------------------------------------------------------------------------------------------------------- */


  /* Power */
  async function isInStockPower(productId) {
    const res = await fetch(`https://www.power.no/umbraco/api/product/getproductsbyids?ids=${productId}`)
    const res_json = await res.json();
    const isInStock = (res_json["0"].StockCount) != 0;
    console.log("is in stock: " + isInStock)
    if(res_json["0"].StockCount != 0) return true;
    else return false;
    
  }

  async function addToCartPower(productId = productIds.power.disk) {

    
    const res = await fetch("https://www.power.no/api/basket/products", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language":
          "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer:
        "https://www.power.no/gaming/gamingmus/dacota-gaming-breach-traadloes-spillmus/p-983894/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{"ProductId":${productId},"DeltaQuantity":1}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    });

    const json = await res.json();
  
    /* debug */

    console.log("Reponse code:" + res.status);
    console.log("Server response: " + JSON.stringify(json));

    /*  Server returnerer kode 200 visst ting er lagt til i handlekurven og er på lager/tilgjegelig for kjøp     */

    if (res.status === 200) {
      return true
    
    } else if (res.status === 400) {
      return false
      
    }

    
  }



  /* Elkjøp */
  async function addToCartElkjop(productId) {
  

    const res = await fetch(
      "https://www.elkjop.no/INTERSHOP/web/WFS/store-elkjop-Site/no_NO/-/NOK/ViewCart-AddProductByAjax?SKU=" +
        productId +
        "&Quantity=1&AddToCart=true",
      {
        headers: {
          accept: "text/html, */*; q=0.01",
          "accept-language":
            "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
          "sec-ch-ua":
            '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        referrer:
          "https://www.elkjop.no/product/gaming/spill/spill-playstation-4/40996/cyberpunk-2077-collector-s-edition-ps4",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );

   
    //product-add-ajax-success
    const res_data = await res.text();
    const htmlDoc = DomParser.parseFromString(res_data.toString(),"text/html");
    const isAddedToCart = htmlDoc.querySelector(".product-add-ajax-success");
    
    if (isAddedToCart) {
      return true
    }

    else {
      return false
    }
   
  }

  
  /* NetOnNet */
  async function addToCartNetonNet(productId) {
    let res = await fetch("https://www.netonnet.no/Checkout/AddItem/", {
      headers: {
        accept: "*/*",
        "accept-language":
          "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer:
        "https://www.netonnet.no/art/gaming/spillogkonsoll/playstation/playstation-spill/ps5-call-of-duty-cold-war/1014293.15690/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `itemId=${productId}&isCheckout=false`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    })

    const res_data = await res.text()
    const htmlDoc = DomParser.parseFromString(res_data.toString(),"text/html")
    const isAddedToCart = htmlDoc.querySelector("#cartListItemCount").getAttribute("value") === "1"

    
    if (isAddedToCart) {
      return true
    }

    else {
      return false
    }
    

    
  }

  /* not tested or functional */
  async function powerAutoCheckout() {
    await fetch("https://www.power.no/api/basket/contactinfo", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language":
          "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: "https://www.power.no/checkout/contactinfo/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body:
        '{"DeliveryInformation":{"Address":"' +
        deliveryInfo.adress +
        '","City":"' +
        deliveryInfo.city +
        '","Email":"' +
        deliveryInfo.email +
        '","FirstName":"' +
        deliveryInfo.firstName +
        '","LastName":"' +
        deliveryInfo.lastName +
        '","Phone":"' +
        deliveryInfo.phone +
        '","PostalCode":"' +
        deliveryInfo.postalCode +
        '","Company":null,"CompanyVATNumber":null,"SSN":null},"ReceiptInformation":{"Address":"' +
        deliveryInfo.adress +
        '","City":"' +
        deliveryInfo.city +
        '","Email":"' +
        deliveryInfo.email +
        '","FirstName":"' +
        deliveryInfo.firstName +
        '","LastName":"' +
        deliveryInfo.lastName +
        '","Phone":"' +
        deliveryInfo.phone +
        '","PostalCode":"' +
        deliveryInfo.postalCode +
        '","Company":null,"CompanyVATNumber":null,"SSN":null},"NewsletterSubscription":false,"Validate":true,"MyPowerClubSubscription":false}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    })

    await fetch("https://www.power.no/api/basket/freight", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language":
          "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: "https://www.power.no/checkout/freight/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"BasketFreightId":1,"FreightId":1}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    });

    await fetch("https://www.power.no/api/basket/paymentMethod", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language":
          "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: "https://www.power.no/checkout/payment/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: "11",
      method: "POST",
      mode: "cors",
      credentials: "include",
    })

    let res = await fetch("https://www.power.no/api/basket/pay", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language":
          "nb-NO,nb;q=0.9,no;q=0.8,nn;q=0.7,en-US;q=0.6,en;q=0.5",
        "content-type": "application/json",
        "sec-ch-ua":
          '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: "https://www.power.no/checkout/payment/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: '{"PaymentMethodId":11,"PaymentDetails":[]}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    })

    let json = await res.json()

    // go to vipps
    window.location.href = json.PaymentUrl
  }

} // end of namespace