
const subcription = {
    plan: [
        {
            type: "Arcade",
            monthly: 9,
            yearly: 90
        },
        {
            type: "Advanced",
            monthly: 12,
            yearly: 120
        },
        {
            type: "Pro",
            monthly: 15,
            yearly: 150
        }
    ],

    addon: [
        {
            type: "Online service",
            monthly: 1,
            yearly: 10
        },
        {
            type: "Larger storage",
            monthly: 2,
            yearly: 20
        },
        {
            type: "Customizable profile",
            monthly: 2,
            yearly: 20
        }
    ]
}


const name_n = document.querySelector('#name_input');
const email = document.querySelector('#email_input');
const phone = document.querySelector('#phone_input');

///////// Navigation Buttons Function

    const nextBtn = document.querySelector('.next_btn');
    const backBtn = document.querySelector('.back_btn');
    const steps = document.querySelectorAll('.step')
    const stepNum = document.querySelectorAll('.step_num')

    let currentStep = 0;

    // activate first step initially
    steps[currentStep].classList.add('active');
    stepNum[currentStep].classList.add('active')

    function updateButtons() {
        if(currentStep === 0) {
            backBtn.style.color = 'hsl(0, 100%, 100%)';
            nextBtn.style.backgroundColor = '--blue-950: hsl(213, 96%, 18%)'
        } else {
            backBtn.style.color = 'hsl(231, 11%, 63%)';
            nextBtn.style.backgroundColor = '--blue-950: hsl(213, 96%, 18%)'
        }
    }
    updateButtons();


    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length -1) {

            // stop if any field has error
            if(
                name_n.classList.contains('error') || 
                email.classList.contains('error') || 
                phone.classList.contains('error')
            ) {
                return;
            }

            // stop if any field is empty
            if(
                name_n.value === "" || 
                email.value === "" || 
                phone.value === ""
            ) {
                return;
            }

            // move to next step
            steps[currentStep].classList.remove('active');
            stepNum[currentStep].classList.remove('active');
            currentStep++;
            steps[currentStep].classList.add('active');
            if(currentStep <= 3) {
                stepNum[currentStep].classList.add('active');
            }

            if(currentStep === 4) {
                stepNum[3].classList.add('active');
                steps[currentStep].classList.remove('active')
                steps[currentStep].classList.add('confirm')
                nextBtn.classList.add('hide')
                backBtn.classList.add('hide')
            }

            updateButtons(); // update navigation button
        }
        updateButtons();
    });


    backBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            steps[currentStep].classList.remove('active');
            stepNum[currentStep].classList.remove('active');
            currentStep--;
            steps[currentStep].classList.add('active');
            stepNum[currentStep].classList.add('active');

            if(currentStep < 4) {
                steps[4].classList.remove('confirm')
            }

            updateButtons();
        }
    });


//////// Personal Info Validation & Function ////////


    function handleSuccess(input) {
        const sibling = input.previousElementSibling;
        const errorMsg = sibling.querySelector('.errorMsg');

        input.classList.remove('error');

        errorMsg.classList.add('hide');
    }


    function handleError(input, message) {
        const sibling = input.previousElementSibling;
        const errorMsg = sibling.querySelector('.errorMsg');

        input.classList.add('error');

        errorMsg.textContent = message;
        errorMsg.classList.remove('hide');
    }


    function debounce(cb, delay) {
        let timer

        return(...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                cb(...args)
            }, delay)
        }
    }


    name_n.addEventListener('input', 
        debounce(() => {
            const nameValue = name_n.value.trim();

            if(nameValue === "") {
                handleError(name_n, 'This field is required')
            } else {
                handleSuccess(name_n)
            }
        }, 1000)
    )
    

    email.addEventListener('input',
        debounce(() => {
            const emailValue = email.value.trim();

            if(emailValue === "") {
                handleError(email, 'This field is required')
            } else if(!emailValue.includes('@') || !emailValue.includes('.')) {
                handleError(email, 'Invalid email address')
            } else {
                handleSuccess(email)
            }
        }, 2000)
    )


    phone.addEventListener('input',
        debounce(() => {
            const phoneValue = phone.value.trim();

            if(phoneValue === "") {
                handleError(phone, 'This field is required')
            } else {
                handleSuccess(phone)
            }
        }, 1000)
    )


    const userSubcription = {
        plan: {
            type: null,
            price: null,
            period: null
        },

        addon: []
    }


//////// Finishing Up Function ////////

    const selectedPlanBox = document.querySelector('.finish_plan');
    const selectedAddOnBox = document.querySelector('.finish_add_on');


//////// Select Plan (Monthly/Yearly) Function ////////

    const plans = document.querySelectorAll('.plan');
    const togglePlan = document.querySelector('.toggle_plan_btn');
    const planBtn = document.querySelector('.plan_btn');
    const planPrice = document.querySelectorAll('.plan_price');
    const addonPrice = document.querySelectorAll('.addon_price');


    let isYearly = false;
    let total = 0;
    let planTotal = 0;

    function formatPrice(price, isYearly) {
        return `$${price}/${isYearly ? "yr" : "mo"}`;
    }

//////// Total ////////

    function calculateTotal() {

        let addonTotal = userSubcription.addon.reduce((sum,item) => {
            return sum + item.price;
        }, 0);

        total = planTotal + addonTotal;

        let totalText = `
            <p>Total (per ${isYearly ? "year" : "month"})</p>
            <p>+$${total}/${isYearly ? "yr" : "mo"}</p>
        `;

        document.querySelector('.finish_total').innerHTML = totalText;
    }

//////// select monthly / yearly plan ////////

    planBtn.addEventListener('click', () => {
        isYearly = !isYearly;

        // toggle UI
        togglePlan.classList.toggle('right');
        planBtn.classList.toggle('active');

        planPrice.forEach((price, index) => {
            const planPrice = isYearly
                ? subcription.plan[index].yearly
                : subcription.plan[index].monthly;
            
            price.querySelector('.price').textContent = formatPrice(planPrice, isYearly);

            price.classList.toggle('active', isYearly);
        });

        addonPrice.forEach((addon, index) => {
            const addonPrice = isYearly
                ? subcription.addon[index].yearly
                : subcription.addon[index].monthly;
            
            addon.querySelector('.price').textContent = formatPrice(addonPrice, isYearly);
        })

        plans.forEach(p => p.classList.remove('plan_selected'))

        add_ons.forEach(add_on => {
            const checkbox = add_on.querySelector("input[type='checkbox']")
            checkbox.checked = false
            add_on.classList.remove('add_on_selected')
        })

        userSubcription.addon = [];
    })

//////// select a plan ////////
    plans.forEach(plan => {
        plan.addEventListener('click', () => {

            // remove from all
            plans.forEach(p => p.classList.remove('plan_selected'));

            // select clicked one
            plan.classList.add('plan_selected');

            userSubcription.plan.type = plan.querySelector('.plan_name').textContent;
            userSubcription.plan.price = parseInt(plan.querySelector('.price').textContent.replace(/\D/g, ""));

            if(isYearly) {
                userSubcription.plan.period = "Yearly"
            } else {
                userSubcription.plan.period = "Monthly"
            }

            selectedPlanBox.innerHTML = "";

            let selected_plan = `
                <div>
                    <p>${userSubcription.plan.type} (${userSubcription.plan.period})</p>
                    <p class='change_plan'>Change</p>
                </div>
                <div>
                    <p>$${userSubcription.plan.price}/${isYearly ? "yr" : "mo"}</p>
                </div>
            `;
            selectedPlanBox.innerHTML += selected_plan;

            const changePlan = document.querySelector('.change_plan')

            changePlan.addEventListener('click', () => {
                steps[currentStep].classList.remove('active')
                stepNum[currentStep].classList.remove('active')
                currentStep = 1;
                steps[currentStep].classList.add('active')
                stepNum[currentStep].classList.add('active')
            })

            planTotal = userSubcription.plan.price;
            calculateTotal();
        })
    });

    
//////// Pick Add On Function ////////

    const add_ons = document.querySelectorAll('.add_on');

    function selectedAddon() {
        let html = "";

        userSubcription.addon.forEach(item => {
            html += `
                <div>
                    <p>${item.type}</p>
                    <p>+$${item.price}/${isYearly ? "yr" : "mo"}</p>
                </div>
            `;

            selectedAddOnBox.innerHTML = html;
        })
    }

    // pick add ons
    add_ons.forEach(add_on => {
        const checkbox = add_on.querySelector("input[type='checkbox']");

        checkbox.checked = false;
        
        // When checkbox changes
        checkbox.addEventListener('change', () => {

            const type = add_on.querySelector('.add_on_name').textContent;
            const price = add_on.querySelector('.price').textContent;

            // toggle UI
            add_on.classList.toggle('add_on_selected', checkbox.checked);

            if(checkbox.checked) {
                const exists = userSubcription.addon.some(item => item.type === type);

                if(!exists) {
                    userSubcription.addon.push(
                        { 
                            type: type, 
                            price: parseInt(price.replace(/\D/g, ""))
                        });
                }
            } else {
                userSubcription.addon = userSubcription.addon.filter(
                    item => item.type !== type
                );
            }
            selectedAddon();
            calculateTotal();
        });
        
        // Clicking the card triggers checkbox
        add_on.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change')); // force sync
        })
    })


