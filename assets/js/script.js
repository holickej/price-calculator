(function($) {   

    AOS.init({
       
        disable: false, 
        startEvent: 'DOMContentLoaded', 
        initClassName: 'aos-init', 
        animatedClassName: 'aos-animate', 
        useClassNames: false, 
        disableMutationObserver: false, 
        debounceDelay: 50, 
        throttleDelay: 99,
      
       
        offset: 20, 
        delay: 0, 
        duration: 2000, 
        easing: 'ease', 
        once: false,
        mirror: true, 
        anchorPlacement: 'top-bottom', 
      });


    let dataToForm = {};
    let selectedOptions = {};
    let selectedMainChoice = "";

    document.addEventListener("DOMContentLoaded", () => {
        const mainChoiceBox = document.getElementById("main-choice");
        const choiceSections = document.querySelectorAll(".choice-section");
        const priceSidebar = document.querySelector(".price-sidebar");
        const mainInfoBox = document.querySelector(".main-info-box");
        const previousButton = document.querySelector(".previous-section");
        const nextButton = document.querySelector(".next-section");
        const priceDisplays = document.querySelectorAll(".price-estimate");
        const mustSelectTooltip = document.getElementById("must-select-tooltip");

        let selectedOptions = {};
        
      
        // Nastavení výchozí ceny
        updatePrice();
      
        // Funkce pro aktualizaci ceny
        function updatePrice() {
          let totalPrice = Object.values(selectedOptions).reduce(
            (sum, price) => sum + price,
            0
          );
          priceDisplays.forEach(
            (display) => (display.textContent = `${totalPrice} Kč`)
          );
        }
      
        // Funkce pro aktualizaci čísla kroku
        function updateStepCounter(currentSection) {
          const totalSteps = currentSection.querySelectorAll("section").length;
          const currentStepIndex = Array.from(
            currentSection.querySelectorAll("section")
          ).findIndex((section) => section.classList.contains("active"));
          const currentStep = currentStepIndex + 1;
          document.querySelector(
            ".choice-step h3"
          ).innerHTML  = `<h3 class="big-number">${currentStep}</h3> / ${totalSteps}`;
        }
      
        // Funkce pro navigaci mezi sekcemi
        function navigateSection(direction) {
          let currentSection = document.querySelector(
            ".choice-section section.active"
          );
          if (!currentSection) return;
      
          const parentSection = currentSection.closest(".choice-section");
          const sections = Array.from(parentSection.querySelectorAll("section"));
          let currentIndex = sections.findIndex(
            (section) => section === currentSection
          );
          let newIndex = currentIndex;
          if (direction < 0) newIndex -= 1;
          //console.log(newIndex, currentIndex);
          //console.log(selectedOptions);
          //console.log(currentSection.getAttribute("id"));
      
          if (
            Object.keys(selectedOptions).includes(currentSection.getAttribute("id"))
          ) {
            newIndex = currentIndex + direction;
          } else if (direction > 0) {
            const mustSelectTooltip = document.getElementById("must-select-tooltip");
            mustSelectTooltip.style.display = "block"; 
            mustSelectTooltip.classList.add("animate__animated", "animate__bounceIn");
            setTimeout(() => { hideTooltip(); }, 1500);

                // Funkce pro skrytí tooltipu s animací
                function hideTooltip() {
                    mustSelectTooltip.classList.replace("animate__bounceIn", "animate__fadeOutRight");
                    mustSelectTooltip.addEventListener('animationend', () => {
                    mustSelectTooltip.style.display = "none";
                    mustSelectTooltip.classList.remove("animate__animated", "animate__fadeOutRight"); 
                    }, {once: true}); 
                }

            /*  //Použití knihovny: https://sweetalert2.github.io/#examples
                Swal.fire({
                icon: 'error',
                title: 'Chyba!',
                text: 'Musíte vybrat alespoň jednu možnost!',
                confirmButtonText: 'Rozumím'
                });
            */
        }
        
      
          if (newIndex >= 0 && newIndex < sections.length) {
            currentSection.classList.remove("active");
            sections[newIndex].classList.add("active");
            updateStepCounter(parentSection);
            highlightSelectedOption(sections[newIndex]); // Zvýrazní vybranou možnost
          }
        }
      
        function showFirstSectionOfChoice(choiceId) {
          // Aplikování fadeOut animace
          mainChoiceBox.classList.add("fadeOut");
          mainInfoBox.classList.add("fadeOut");
        
          // Počkání na dokončení fadeOut animace
          setTimeout(() => {
              mainChoiceBox.style.display = "none";
              mainInfoBox.style.display = "none";
              
              // Skrytí a odstranění všech sekcí kromě vybrané
              choiceSections.forEach((section) => {
                  if(section.id !== choiceId) {
                      section.remove(); // Odstranění sekce z DOM
                  }
              });
              
              // Zobrazení první sekce vybraného typu webu, pokud existuje
              const chosenSection = document.querySelector(`.choice-section#${choiceId}`);
              if (chosenSection) {
                  // Přidání fadeIn animace pro chosenSection
                  chosenSection.classList.add("fadeIn");
                  chosenSection.style.display = "flex";
                  
                  const firstSection = chosenSection.querySelector("section");
                  if (firstSection) {
                      firstSection.classList.add("active");
                  }
                  
                  // Přidání fadeIn animace pro priceSidebar a nastavení jeho zobrazení
                  priceSidebar.classList.add("fadeIn", "show");
                  updateStepCounter(chosenSection);
              }
          }, 500); 
      }
      
  
      
        // Funkce pro zvýraznění vybrané možnosti
        function highlightSelectedOption(section) {
          const sectionId = section.id;
      
          if (selectedOptions[sectionId] !== undefined) {
            const selectedPrice = selectedOptions[sectionId];
            const options = section.querySelectorAll("a");
            options.forEach((option) => {
              const price = parseInt(option.getAttribute("data-price"));
              if (price === selectedPrice) {
                option.classList.add("active");
              } else {
                option.classList.remove("active");
              }
            });
          }
        }
      
        // Přidání event listeneru na hlavní volby
        mainChoiceBox.addEventListener("click", (e) => {
            e.preventDefault();
            const choiceId = e.target.closest("div[id]").id;
            showFirstSectionOfChoice(choiceId);
            selectedMainChoice = choiceId; 
            window.selectedMainChoice = selectedMainChoice;
            //console.log(selectedMainChoice); 
        });
        
      
        // Event listener pro tlačítka 'další' a 'zpět'
        previousButton.addEventListener("click", (e) => {
          e.preventDefault();
          navigateSection(-1);
        });
      
        nextButton.addEventListener("click", (e) => {
          e.preventDefault();
          navigateSection(1);
        });
      
        // Event listener pro volby v sekcích
        choiceSections.forEach((section, index) => {
          section.addEventListener("click", (e) => {
            const choice = e.target.closest("a");
            if (choice && choice.hasAttribute("data-price")) {
              e.preventDefault();
      
              const price = parseInt(choice.getAttribute("data-price"));
              // const sectionId = `${
              //   section.id
              // } ${choice.parentNode.parentNode.getAttribute("id")}`;
              const sectionId = choice.parentNode.parentNode.getAttribute("id");
      
              if (!isNaN(price)) {
                // Aktualizace ceny a výběru
                selectedOptions[sectionId] = price;
                dataToForm[sectionId] = choice.textContent.trim(); // Uchování vybrané možnosti
                //console.log(dataToForm);
                //console.log(selectedOptions);
                updatePrice();
      
                // Zvýraznění aktuálně vybrané možnosti
                choice.classList.add("active");
      
                // Automatický přechod na další sekci (pokud není poslední)
                if (index <= choiceSections.length - 1) {
                  setTimeout(() => navigateSection(1), 200);
                }
              }
            }
          });
        });
      
        
        window.dataToForm = dataToForm;
        window.selectedOptions = selectedOptions;
        
        
      });


      //AJAX FORMULAR START CENOTVORBA

document.addEventListener("DOMContentLoaded", function() {
  
  let formElements = document.querySelectorAll("form[id^='price-calculator-form']");

  formElements.forEach(function(formElement) {
      formElement.addEventListener("submit", function (event) {
          event.preventDefault();

          var existingInput = formElement.querySelector('#hiddenMainChoice');
          if (existingInput) {
              existingInput.value = window.selectedMainChoice; 
          } else {
              // Vytvoření skrytého input pole, pokud neexistuje
              var hiddenInput = document.createElement("input");
              hiddenInput.setAttribute("type", "hidden");
              hiddenInput.setAttribute("id", "hiddenMainChoice");
              hiddenInput.setAttribute("name", "selectedMainChoice");
              hiddenInput.value = window.selectedMainChoice;

              formElement.appendChild(hiddenInput); // Přidání do formuláře
          }

          let formData = new FormData(formElement);
          let submitFormUrl = formElement.querySelector("#submit_form_url").value;
          let submitButton = formElement.querySelector("button[type='submit']");

          // Přidání JSON dat do objektu FormData
          if (window.dataToForm) {
              formData.append('dataToForm', JSON.stringify(window.dataToForm));
          }
          if (window.selectedOptions) {
              formData.append('selectedOptions', JSON.stringify(window.selectedOptions));
          }

          // Přidání ikony pro načítání
          let loadingIcon = document.createElement("i");
          loadingIcon.className = "fas fa-spinner fa-spin";
          loadingIcon.style.display = "none";
          submitButton.appendChild(loadingIcon);

          loadingIcon.style.display = "inline-block"; // Zobrazení ikony pro načítání

          // Nastavení a odeslání AJAX požadavku
          let xhr = new XMLHttpRequest();
          xhr.open("POST", submitFormUrl, true);
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  // Úspěšné odeslání
                  displayMessage("Email byl úspěšně odeslán", "success-message", "animate__animated", "animate__fadeIn", formElement);
                  formElement.reset(); // Resetování formuláře
              } else if (xhr.readyState == 4) {
                  // Chyba při odeslání
                  displayMessage("Nepodařilo se odeslat email", "error-message", "animate__animated", "animate__bounceIn", formElement);
              }
              
              loadingIcon.style.display = "none"; // Skrytí ikony pro načítání po dokončení
          };
          xhr.send(formData);
      });
  });
});

function displayMessage(message, cssClass, animationClass, entranceAnimation, formElement) {
  let messageContainer = document.createElement("div");
  messageContainer.className = `${cssClass} ${animationClass} ${entranceAnimation}`;
  messageContainer.innerHTML = message;

  formElement.parentNode.insertBefore(messageContainer, formElement.nextSibling); // Změna pozice zprávy

  setTimeout(function () {
      messageContainer.classList.remove(entranceAnimation);
      messageContainer.classList.add("animate__fadeOutDown");

      setTimeout(function () {
          messageContainer.remove();
      }, 1000);
  }, 5000);
}




//AJAX FORMULAR END
      
})(jQuery);
