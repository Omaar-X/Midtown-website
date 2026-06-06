document.addEventListener("DOMContentLoaded",function(){setCurrentYear();setActiveNavLink();prefillProjectSelection();initFormValidation();});function setCurrentYear(){const el=document.getElementById("currentYear");if(el)el.textContent=new Date().getFullYear();}
function setActiveNavLink(){const currentPage=window.location.pathname.split("/").pop();document.querySelectorAll(".navbar-nav .nav-link").forEach((link)=>{const href=link.getAttribute("href");if(href===currentPage||(currentPage===""&&href==="index.html")||(currentPage==="contact.html"&&href==="contact.html")){link.classList.add("active");}else if(href!=="contact.html"){link.classList.remove("active");}});}
function prefillProjectSelection(){const selectedProject=sessionStorage.getItem("selectedProject");const projectSelect=document.getElementById("project");if(!selectedProject||!projectSelect)return;for(let option of projectSelect.options){if(option.text.toLowerCase().includes(selectedProject.toLowerCase())){projectSelect.value=option.value;break;}}
sessionStorage.removeItem("selectedProject");}
function initFormValidation(){const form=document.getElementById("contactForm");if(!form)return;form.querySelectorAll("input, textarea, select").forEach((field)=>{field.addEventListener("input",()=>field.classList.remove("is-invalid"));field.addEventListener("change",()=>field.classList.remove("is-invalid"));});form.addEventListener("submit",function(e){e.preventDefault();let isValid=true;this.querySelectorAll("[required]").forEach((field)=>{if(!field.value.trim()){field.classList.add("is-invalid");isValid=false;}else{field.classList.remove("is-invalid");}});const emailField=document.getElementById("email");if(emailField&&emailField.value&&!isValidEmail(emailField.value)){emailField.classList.add("is-invalid");isValid=false;}
const phoneField=document.getElementById("phone");if(phoneField&&phoneField.value&&!isValidPhone(phoneField.value)){phoneField.classList.add("is-invalid");isValid=false;}
if(!isValid){const firstInvalid=form.querySelector(".is-invalid");if(firstInvalid){firstInvalid.scrollIntoView({behavior:"smooth",block:"center"});firstInvalid.focus();}
return;}
const name=document.getElementById("name").value.trim();const phone=document.getElementById("phone").value.trim();const email=emailField?emailField.value.trim():"";const subject=document.getElementById("subject");const subjectText=subject?subject.options[subject.selectedIndex].text:"";const project=document.getElementById("project");const projectText=project?project.options[project.selectedIndex].text:"";const message=document.getElementById("message").value.trim();const waMessage=`*New Enquiry – MIDTOWN AABASHON LTD*\n\n`+`*Name:* ${name}\n`+`*Phone:* ${phone}\n`+
(email?`*Email:* ${email}\n`:"")+`*Subject:* ${subjectText}\n`+
(projectText&&projectText!=="Any Project"?`*Project:* ${projectText}\n`:"")+`\n*Message:*\n${message}`;const waURL="https://wa.me/8801950010200?text="+encodeURIComponent(waMessage);showSuccessMessage(form);window.open(waURL,"_blank");form.reset();});}
function showSuccessMessage(form){const existing=document.getElementById("formSuccessBanner");if(existing)existing.remove();const banner=document.createElement("div");banner.id="formSuccessBanner";banner.style.cssText=`
    background: linear-gradient(135deg, #1f9d55, #39a949);
    color: #fff;
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: fadeIn 0.4s ease;
  `;banner.innerHTML=`
    <i class="fa-solid fa-circle-check" style="font-size:1.3rem;"></i>
    <span>আপনার বার্তা পাঠানো হচ্ছে WhatsApp-এ। ধন্যবাদ! আমরা ২৪ ঘণ্টার মধ্যে যোগাযোগ করব।</span>
  `;form.insertAdjacentElement("beforebegin",banner);setTimeout(()=>{banner.style.opacity="0";banner.style.transition="opacity 0.5s ease";setTimeout(()=>banner.remove(),500);},6000);}
function isValidEmail(email){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
function isValidPhone(phone){return/^[0-9+\-\s()]{10,}$/.test(phone);}
