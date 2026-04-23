/**
 * Language Manager — Hindi + English Support
 */

const LangManager = {
  currentLang: 'en',

  translations: {
    en: {
      // Header
      logo: 'SchemeFinder',
      logoDot: '.in',
      navHowItWorks: 'How It Works',
      navSchemes: 'Schemes',
      navFaq: 'FAQ',

      // Hero
      heroBadge: '🇮🇳 Free Government Scheme Checker',
      heroTitle1: 'You might be missing',
      heroHighlight: '₹2,50,000+',
      heroTitle2: 'in government benefits',
      heroSubtitle: 'Enter your details below. We\'ll check 30+ government schemes you may qualify for.',
      heroFree: '100% free to check.',
      statPeople: 'people checked today',
      statSchemes: 'schemes tracked',
      statMax: 'max benefit found',

      // Form
      formTitle: 'Check Your Eligibility',
      formSubtitle: 'Fill in your details — takes less than 30 seconds',
      labelAge: 'Your Age',
      placeholderAge: 'e.g., 28',
      labelGender: 'Gender',
      selectGender: 'Select',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      labelState: 'State / UT',
      selectState: 'Select State',
      labelIncome: 'Annual Family Income (₹)',
      selectIncome: 'Select Range',
      labelOccupation: 'Occupation',
      selectOccupation: 'Select',
      labelCategory: 'Category',
      selectCategory: 'Select',

      // Occupations
      occ_farmer: 'Farmer',
      occ_agricultural_worker: 'Agricultural Worker',
      occ_salaried: 'Salaried / Job',
      occ_business_owner: 'Business Owner',
      occ_self_employed: 'Self Employed',
      occ_freelancer: 'Freelancer / Gig Worker',
      occ_student: 'Student',
      occ_unemployed: 'Unemployed',
      occ_daily_wage: 'Daily Wage Worker',
      occ_street_vendor: 'Street Vendor',
      occ_homemaker: 'Homemaker',
      occ_retired: 'Retired',

      // Categories
      cat_general: 'General',
      cat_obc: 'OBC',
      cat_sc: 'SC',
      cat_st: 'ST',
      cat_ews: 'EWS',

      // Extras
      extrasTitle: 'A few more questions (helps find more schemes)',
      checkStudent: 'I am a student',
      checkLand: 'I own agricultural land',
      checkHouse: 'I own a house (pucca)',
      checkRural: 'I live in a rural area',
      checkRation: 'I have a ration card',

      // Buttons
      btnSearch: '🔍 Find My Schemes',
      btnSearching: 'Searching...',
      btnUnlock: '🔓 Unlock Now — ₹99',
      btnApply: 'Apply Now →',

      // Results
      resultsFound: 'We found',
      resultsSchemes: 'schemes for you!',
      resultsBasedOn: 'Based on your profile:',
      totalBenefit: '💰 Total potential benefit:',
      match: 'match',

      // Paywall
      paywallTitle: 'Unlock All Your Eligible Schemes',
      paywallDesc: 'See full details, documents needed, and direct apply links for all matched schemes.',
      paywallOriginal: '₹499',
      paywallNow: '₹99',
      paywallNote: 'one-time • lifetime access',
      feature1: '✅ Full scheme details',
      feature2: '✅ Documents checklist',
      feature3: '✅ Direct apply links',
      feature4: '✅ Eligibility confirmation',
      feature5: '✅ Future scheme updates',
      paywallSecure: '🔒 Secure payment via Razorpay',
      paywallMethods: '💳 UPI / Cards / Net Banking',

      // Lock overlay
      lockIcon: '🔒',
      lockText: 'Unlock to see details',

      // Cards
      docsRequired: '📄 Documents Required:',
      whyMatch: 'Why you match:',
      ministry: 'Ministry:',

      // No results
      noResults: 'No schemes matched your profile',
      noResultsDesc: 'This could mean your income/occupation doesn\'t currently qualify for tracked schemes. Try adjusting your details or check back later.',

      // How It Works
      howTitle: 'How It Works',
      step1Title: 'Enter Details',
      step1Desc: 'Fill in your age, income, occupation, and other basic details. Takes 30 seconds.',
      step2Title: 'We Match',
      step2Desc: 'Our engine checks your profile against 30+ government schemes instantly.',
      step3Title: 'Get Results',
      step3Desc: 'See all schemes you qualify for with benefits, documents needed, and apply links.',
      step4Title: 'Apply',
      step4Desc: 'Click the apply link and follow the instructions. Most applications are online now.',

      // Schemes Section
      schemesTitle: 'Popular Government Schemes',
      schemesSubtitle: 'Some of the most impactful schemes available right now',
      checkEligibility: 'Check Eligibility →',

      // FAQ
      faqTitle: 'Frequently Asked Questions',
      faq1q: 'Is this free to use?',
      faq1a: 'Checking your eligibility is 100% free. You can see how many schemes you match and the first scheme details for free. To unlock all scheme details, documents needed, and direct apply links, there\'s a one-time fee of ₹99.',
      faq2q: 'How accurate is the eligibility check?',
      faq2a: 'We use official eligibility criteria from government sources. However, final eligibility is determined by the implementing authority. Our tool gives you a strong indication of what you may qualify for.',
      faq3q: 'Is my data safe?',
      faq3a: 'Yes. We don\'t store your personal details on our servers. All matching happens in your browser. We only use anonymous analytics to improve our service.',
      faq4q: 'How often is the data updated?',
      faq4a: 'We update our scheme database regularly as new schemes are announced or eligibility criteria change. Last updated: April 2026.',
      faq5q: 'Can I check for my family members?',
      faq5a: 'Absolutely! You can run multiple checks with different profiles. Many users check for their parents, spouse, and children.',
      faq6q: 'What payment methods do you accept?',
      faq6a: 'We accept UPI (Google Pay, PhonePe, Paytm), all major debit/credit cards, and net banking through Razorpay.',
      faq7q: 'What if I\'m not eligible for any scheme?',
      faq7a: 'If no schemes match your profile, it likely means your income/occupation doesn\'t currently qualify for the schemes we track. New schemes are added regularly, so check back later.',

      // CTA
      ctaTitle: 'Don\'t miss out on benefits you deserve',
      ctaDesc: 'Millions of Indians leave government benefits unclaimed simply because they don\'t know they\'re eligible.',
      ctaBtn: 'Check Your Eligibility Now — Free',

      // Footer
      footerDesc: 'Helping Indians discover government benefits they\'re entitled to.',
      footerQuickLinks: 'Quick Links',
      footerPopular: 'Popular Schemes',
      footerDisclaimer: 'Disclaimer: This tool provides indicative eligibility information. Final decisions rest with the implementing authority.',

      // Cookie banner
      cookieText: '🍪 We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our use of cookies.',
      cookieAccept: 'Accept All',
      cookieReject: 'Reject Non-Essential',
      cookiePolicy: 'Privacy Policy',

      // Toasts
      toastCookieSaved: 'Cookie preferences saved',
      toastCookieRejected: 'Non-essential cookies disabled',
      toastUnlocked: '✅ All schemes unlocked! Scroll down to see details.',
      toastAlreadyUnlocked: 'You already have access! Scroll down to see all schemes.',
      toastPaymentFailed: 'Payment failed. Please try again.',

      // Currency
      currency: '₹',
      incomeRanges: {
        '0': 'Below ₹50,000',
        '50000': '₹50,000 - ₹1,00,000',
        '100000': '₹1,00,000 - ₹2,00,000',
        '200000': '₹2,00,000 - ₹3,00,000',
        '300000': '₹3,00,000 - ₹5,00,000',
        '500000': '₹5,00,000 - ₹8,00,000',
        '800000': '₹8,00,000 - ₹10,00,000',
        '1000000': '₹10,00,000 - ₹15,00,000',
        '1500000': '₹15,00,000 - ₹18,00,000',
        '1800000': 'Above ₹18,00,000'
      }
    },

    hi: {
      // Header
      logo: 'स्कीमफाइंडर',
      logoDot: '.in',
      navHowItWorks: 'कैसे काम करता है',
      navSchemes: 'योजनाएं',
      navFaq: 'सवाल-जवाब',

      // Hero
      heroBadge: '🇮🇳 मुफ्त सरकारी योजना चेकर',
      heroTitle1: 'आप शायद चूक रहे हैं',
      heroHighlight: '₹2,50,000+',
      heroTitle2: 'सरकारी लाभ',
      heroSubtitle: 'नीचे अपनी जानकारी भरें। हम 30+ सरकारी योजनाओं में आपकी पात्रता जांचेंगे।',
      heroFree: 'जांचना 100% मुफ्त है।',
      statPeople: 'लोगों ने आज चेक किया',
      statSchemes: 'योजनाएं ट्रैक की गईं',
      statMax: 'अधिकतम लाभ मिला',

      // Form
      formTitle: 'अपनी पात्रता जांचें',
      formSubtitle: 'अपनी जानकारी भरें — 30 सेकंड से भी कम समय लगता है',
      labelAge: 'आपकी उम्र',
      placeholderAge: 'जैसे, 28',
      labelGender: 'लिंग',
      selectGender: 'चुनें',
      male: 'पुरुष',
      female: 'महिला',
      other: 'अन्य',
      labelState: 'राज्य / केंद्र शासित',
      selectState: 'राज्य चुनें',
      labelIncome: 'वार्षिक पारिवारिक आय (₹)',
      selectIncome: 'रेंज चुनें',
      labelOccupation: 'व्यवसाय',
      selectOccupation: 'चुनें',
      labelCategory: 'श्रेणी',
      selectCategory: 'चुनें',

      // Occupations
      occ_farmer: 'किसान',
      occ_agricultural_worker: 'कृषि मजदूर',
      occ_salaried: 'नौकरीपेशा',
      occ_business_owner: 'व्यापारी',
      occ_self_employed: 'स्वरोजगार',
      occ_freelancer: 'फ्रीलांसर / गिग वर्कर',
      occ_student: 'छात्र',
      occ_unemployed: 'बेरोजगार',
      occ_daily_wage: 'दिहाड़ी मजदूर',
      occ_street_vendor: 'रेड़ी/ठेला वाला',
      occ_homemaker: 'गृहिणी',
      occ_retired: 'सेवानिवृत्त',

      // Categories
      cat_general: 'सामान्य',
      cat_obc: 'OBC',
      cat_sc: 'SC',
      cat_st: 'ST',
      cat_ews: 'EWS',

      // Extras
      extrasTitle: 'कुछ और सवाल (और योजनाएं खोजने में मदद करते हैं)',
      checkStudent: 'मैं छात्र हूं',
      checkLand: 'मेरे पास कृषि भूमि है',
      checkHouse: 'मेरे पास पक्का मकान है',
      checkRural: 'मैं ग्रामीण क्षेत्र में रहता हूं',
      checkRation: 'मेरे पास राशन कार्ड है',

      // Buttons
      btnSearch: '🔍 मेरी योजनाएं खोजें',
      btnSearching: 'खोज रहे हैं...',
      btnUnlock: '🔓 अभी अनलॉक करें — ₹99',
      btnApply: 'अभी आवेदन करें →',

      // Results
      resultsFound: 'हमें मिलीं',
      resultsSchemes: 'योजनाएं आपके लिए!',
      resultsBasedOn: 'आपकी प्रोफाइल के आधार पर:',
      totalBenefit: '💰 कुल संभावित लाभ:',
      match: 'मैच',

      // Paywall
      paywallTitle: 'सभी पात्र योजनाएं अनलॉक करें',
      paywallDesc: 'सभी मिली योजनाओं की पूरी जानकारी, जरूरी दस्तावेज, और सीधे आवेदन लिंक देखें।',
      paywallOriginal: '₹499',
      paywallNow: '₹99',
      paywallNote: 'एक बार • जीवनभर एक्सेस',
      feature1: '✅ पूरी योजना जानकारी',
      feature2: '✅ दस्तावेज चेकलिस्ट',
      feature3: '✅ सीधे आवेदन लिंक',
      feature4: '✅ पात्रता पुष्टि',
      feature5: '✅ भविष्य की योजना अपडेट',
      paywallSecure: '🔒 Razorpay से सुरक्षित भुगतान',
      paywallMethods: '💳 UPI / कार्ड / नेट बैंकिंग',

      // Lock overlay
      lockIcon: '🔒',
      lockText: 'जानकारी देखने के लिए अनलॉक करें',

      // Cards
      docsRequired: '📄 जरूरी दस्तावेज:',
      whyMatch: 'आप क्यों मैच हैं:',
      ministry: 'मंत्रालय:',

      // No results
      noResults: 'कोई योजना आपकी प्रोफाइल से मैच नहीं हुई',
      noResultsDesc: 'इसका मतलब हो सकता है कि आपकी आय/व्यवसाय वर्तमान में ट्रैक की गई योजनाओं के लिए पात्र नहीं है। अपनी जानकारी बदलकर देखें।',

      // How It Works
      howTitle: 'कैसे काम करता है',
      step1Title: 'जानकारी भरें',
      step1Desc: 'अपनी उम्र, आय, व्यवसाय, और अन्य जानकारी भरें। 30 सेकंड लगते हैं।',
      step2Title: 'हम मैच करते हैं',
      step2Desc: 'हमारा इंजन आपकी प्रोफाइल को 30+ सरकारी योजनाओं से तुरंत मैच करता है।',
      step3Title: 'परिणाम पाएं',
      step3Desc: 'देखें कि आप किन योजनाओं के लिए पात्र हैं — लाभ, दस्तावेज, और आवेदन लिंक के साथ।',
      step4Title: 'आवेदन करें',
      step4Desc: 'आवेदन लिंक पर क्लिक करें और निर्देशों का पालन करें। अधिकांश आवेदन अब ऑनलाइन हैं।',

      // Schemes Section
      schemesTitle: 'लोकप्रिय सरकारी योजनाएं',
      schemesSubtitle: 'अभी उपलब्ध कुछ सबसे महत्वपूर्ण योजनाएं',
      checkEligibility: 'पात्रता जांचें →',

      // FAQ
      faqTitle: 'अक्सर पूछे जाने वाले सवाल',
      faq1q: 'क्या यह मुफ्त है?',
      faq1a: 'पात्रता जांचना 100% मुफ्त है। आप देख सकते हैं कि आप कितनी योजनाओं के लिए पात्र हैं और पहली योजना की जानकारी मुफ्त है। सभी योजनाओं की पूरी जानकारी के लिए ₹99 का एक बार शुल्क है।',
      faq2q: 'पात्रता जांच कितनी सटीक है?',
      faq2a: 'हम सरकारी स्रोतों से आधिकारिक पात्रता मानदंड का उपयोग करते हैं। हालांकि, अंतिम पात्रता कार्यान्वयन प्राधिकारी द्वारा निर्धारित की जाती है।',
      faq3q: 'क्या मेरा डेटा सुरक्षित है?',
      faq3a: 'हां। हम आपकी व्यक्तिगत जानकारी अपने सर्वर पर स्टोर नहीं करते। सारी मैचिंग आपके ब्राउज़र में होती है।',
      faq4q: 'डेटा कितनी बार अपडेट होता है?',
      faq4a: 'हम नई योजनाओं की घोषणा होने पर अपना डेटाबेस नियमित रूप से अपडेट करते हैं। अंतिम अपडेट: अप्रैल 2026।',
      faq5q: 'क्या मैं अपने परिवार के सदस्यों के लिए चेक कर सकता हूं?',
      faq5a: 'बिल्कुल! आप अलग-अलग प्रोफाइल के साथ कई बार चेक कर सकते हैं।',
      faq6q: 'आप कौन से भुगतान तरीके स्वीकार करते हैं?',
      faq6a: 'हम UPI (Google Pay, PhonePe, Paytm), सभी प्रमुख डेबिट/क्रेडिट कार्ड, और नेट बैंकिंग स्वीकार करते हैं।',
      faq7q: 'अगर मैं किसी योजना के लिए पात्र नहीं हूं तो?',
      faq7a: 'अगर कोई योजना मैच नहीं हुई, तो इसका मतलब है कि आपकी आय/व्यवसाय वर्तमान में पात्र नहीं है। नई योजनाएं नियमित रूप से जोड़ी जाती हैं।',

      // CTA
      ctaTitle: 'आपके हक के लाभ न चूकें',
      ctaDesc: 'लाखों भारतीय सरकारी लाभ इसलिए नहीं लेते क्योंकि उन्हें पता ही नहीं कि वे पात्र हैं।',
      ctaBtn: 'अभी अपनी पात्रता जांचें — मुफ्त',

      // Footer
      footerDesc: 'भारतीयों को उनके सरकारी लाभ खोजने में मदद करना।',
      footerQuickLinks: 'त्वरित लिंक',
      footerPopular: 'लोकप्रिय योजनाएं',
      footerDisclaimer: 'अस्वीकरण: यह टूल सांकेतिक पात्रता जानकारी प्रदान करता है। अंतिम निर्णय कार्यान्वयन प्राधिकारी के पास है।',

      // Cookie banner
      cookieText: '🍪 हम आपके अनुभव को बेहतर बनाने और ट्रैफ़िक विश्लेषण के लिए कुकीज़ का उपयोग करते हैं।',
      cookieAccept: 'सभी स्वीकार करें',
      cookieReject: 'गैर-जरूरी अस्वीकार करें',
      cookiePolicy: 'गोपनीयता नीति',

      // Toasts
      toastCookieSaved: 'कुकी प्राथमिकताएं सेव हो गईं',
      toastCookieRejected: 'गैर-जरूरी कुकीज़ बंद कर दी गईं',
      toastUnlocked: '✅ सभी योजनाएं अनलॉक! नीचे स्क्रॉल करें।',
      toastAlreadyUnlocked: 'आपके पास पहले से एक्सेस है! नीचे स्क्रॉल करें।',
      toastPaymentFailed: 'भुगतान विफल रहा। कृपया पुनः प्रयास करें।',

      // Currency
      currency: '₹',
      incomeRanges: {
        '0': '₹50,000 से कम',
        '50000': '₹50,000 - ₹1,00,000',
        '100000': '₹1,00,000 - ₹2,00,000',
        '200000': '₹2,00,000 - ₹3,00,000',
        '300000': '₹3,00,000 - ₹5,00,000',
        '500000': '₹5,00,000 - ₹8,00,000',
        '800000': '₹8,00,000 - ₹10,00,000',
        '1000000': '₹10,00,000 - ₹15,00,000',
        '1500000': '₹15,00,000 - ₹18,00,000',
        '1800000': '₹18,00,000 से अधिक'
      }
    }
  },

  /**
   * Get translation
   */
  t(key) {
    const lang = this.translations[this.currentLang] || this.translations.en;
    return lang[key] || this.translations.en[key] || key;
  },

  /**
   * Switch language
   */
  switchLang(lang) {
    this.currentLang = lang;
    localStorage.setItem('scheme_finder_lang', lang);
    document.documentElement.lang = lang;
    this.applyTranslations();
  },

  /**
   * Get saved language
   */
  getSavedLang() {
    return localStorage.getItem('scheme_finder_lang') || 'en';
  },

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (el.tagName === 'INPUT' && el.type !== 'checkbox') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    });

    // Update page title
    document.title = this.currentLang === 'hi'
      ? 'सरकारी योजनाएं खोजें | मुफ्त पात्रता जांच'
      : 'Find Government Schemes You\'re Eligible For | Free Check';
  },

  /**
   * Initialize language
   */
  init() {
    this.currentLang = this.getSavedLang();
    document.documentElement.lang = this.currentLang;
  }
};

// Export
if (typeof window !== 'undefined') {
  window.LangManager = LangManager;
}
