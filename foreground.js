{
  // anonomous namespace

  /* ---- State ------------------------------------------------------------------ */
  let digitalVersion = false; //
  let attempts = 0;
  let autoCheckoutEnabled = false;
  let hasProduct = false;
  let attemptmode = "patrol";
  const notificationVideoYoutubeURL = "https://youtu.be/Y6ljFaKRTrI?t=6";


 

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



  /* ---- Init ------------------------------------------------------------------ */

  createGUI();
  startAttempts();

  /* ---------------------------------------------------------------------------- */

  async function startAttempts() {

    if(sessionStorage.getItem("playStationAddedToCart")) return;

    const startTimer = (new Date()).getTime();
    const attemptResult = await addToCart();
    const endTimer = (new Date()).getTime();

   
    console.log("Attempt results: ")
    console.log(attemptResult)
    console.log("Reponse time: " + (endTimer - startTimer));
    updateAttempts();
    updateServerResponseTime((endTimer - startTimer) + " ms");

    if(attemptResult === "positive") {
      sessionStorage.setItem('playStationAddedToCart', 'true');
      return notifyUserOfSuccess();
    }

    else {
      const f = getAttemptFrequency()
      console.log(f);
      await sleep(f);
      startAttempts();
 
    }
    

  
    

    /* old loop
    window.setInterval(() => {

      if(inflight) return;
      inflight = true;
      window.setTimeout(() => {


        //if (!hasProduct) attempt();
        
        
        console.log(getAttemptFrequency())
        inflight = false;


      },getAttemptFrequency())
      


    }, 10);
    */

  }
  async function addToCart() {

    if(window.location.hostname === "www.power.no") {
    
   
      const productId = digitalVersion ? productIds.power.digital : productIds.power.disk;
      return await isInStockPower(productId) ? await addToCartPower(productId) : "negative";
    }

    else if(window.location.hostname ==="www.elkjop.no") {
      return await addToCartElkjop(digitalVersion ? productIds.elkjop.digital : productIds.elkjop.disk)
    }

    else if(window.location.hostname ==="www.netonnet.no") {

      return await addToCartNetonNet(digitalVersion ? productIds.elkjop.digital : productIds.elkjop.disk);
     
    }


  }

  async function isInStockPower(productId) {
    const res = await fetch(`https://www.power.no/umbraco/api/product/getproductsbyids?ids=${productId}`)
    const res_json = await res.json();
    const isInStock = (res_json["0"].StockCount) != 0;
    console.log("is in stock: " + isInStock)
    if(res_json["0"].StockCount != 0) return true;
    else return false;
    
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

    console.log(container.querySelectorAll("input[name='botspeed']"));
    

    container.querySelectorAll("[name='botspeed']").forEach(el => {
      console.log("here");
      el.onclick = (e) => {
        const value = e.target.value;
        attemptmode = e.target.value;
      };
    })

    container.querySelectorAll("[name='konsolltype']").forEach(el => {
      console.log("here");
      el.onclick = (e) => {
        const value = e.target.value;
        digitalVersion = value === "digital" ? true : false;
        console.log(digitalVersion);
      };
    })

    document.body.appendChild(container);

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
    console.log(res_data);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(res_data.toString(),"text/html");
    const isAddedToCart = htmlDoc.querySelector(".product-add-ajax-success");

    console.log("is added to cart elkjop??:" + isAddedToCart)

    
    if (isAddedToCart) {
      return "positive"
    }

    else {
      return "negative"
    }
   
  }


  function notifyUserOfSuccess(){
    window.open(notificationVideoYoutubeURL);
 
    window.focus();
    /*
    const c = document.querySelector(".bot-panel-container");
    c.innerHTML += `<iframe style="display:none;z-index:-100;" width="560" height="315" src="https://www.youtube.com/embed/ILWSp0m9G2U" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    */
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

    /*  server returnerer kode 200 visst ting er lagt til i handlekurven og er på lager/tilgjegelig for kjøp     */

    if (res.status === 200 && !hasProduct) {
      console.log(" ITS HAPPENING!!!");
      // Go to cart -> kjøp med kort vipps insta
      hasProduct = true;
      //notifyUserOfSuccess();
      //autoCheckoutEnabled && powerAutoCheckout();
      return "positive";
    
    } else if (res.status === 400) {
      console.log(" keeeP tryIN");
      return "negative"
      
    }

    
  }

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
    });

    const res_data = await res.text();
    console.log(res_data);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(res_data.toString(),"text/html");
    const isAddedToCart = htmlDoc.querySelector("#cartListItemCount").getAttribute("value") === "1";

    
    if (isAddedToCart) {
      return "positive"
    }

    else {
      return "negative"
    }
    

    
  }

} // end of namespace
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
  });

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
  });

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
  });

  let json = await res.json();

  // go to vipps
  window.location.href = json.PaymentUrl;
}
