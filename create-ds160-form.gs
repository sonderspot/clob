/**
 * DS-160 Data Collection Form Generator
 * 
 * HOW TO USE:
 * 1. Go to script.google.com
 * 2. Create new project
 * 3. Paste this entire script
 * 4. Click Run > createDS160Form
 * 5. Authorize when prompted
 * 6. Check your Google Drive for "DS-160 Visa Application Data"
 */

function createDS160Form() {
  var form = FormApp.create('DS-160 Visa Application Data');
  form.setDescription('This form collects information needed to complete your US B1/B2 visa application (DS-160). All data is private and only shared with authorized people.\n\n⚠️ Please fill out accurately — this info goes directly on your visa application.');
  form.setCollectEmail(true);
  form.setLimitOneResponsePerUser(false);
  form.setAllowResponseEdits(true);
  
  // ===== SECTION 1: PERSONAL INFO =====
  form.addPageBreakItem().setTitle('Personal Information');
  
  form.addTextItem()
    .setTitle('Full Name (as shown on passport)')
    .setHelpText('Example: IVANOVA TETIANA')
    .setRequired(true);
  
  form.addTextItem()
    .setTitle('Full Name in Native Alphabet')
    .setHelpText('Example: ІВАНОВА ТЕТЯНА')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Other Names Used')
    .setHelpText('Maiden name, previous names, aliases. Leave blank if none.');
    
  form.addDateItem()
    .setTitle('Date of Birth')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('City of Birth')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Country of Birth')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Nationality')
    .setHelpText('As shown on passport')
    .setRequired(true);
  
  form.addMultipleChoiceItem()
    .setTitle('Do you hold any other nationality?')
    .setChoiceValues(['No', 'Yes'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('If yes, which other nationality?');
  
  // ===== SECTION 2: PASSPORT =====
  form.addPageBreakItem().setTitle('Passport Information');
  
  form.addTextItem()
    .setTitle('Passport Number')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Passport Book Number')
    .setHelpText('Leave blank if not shown on passport');
    
  form.addTextItem()
    .setTitle('Country That Issued Passport')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('City Where Passport Was Issued')
    .setRequired(true);
    
  form.addDateItem()
    .setTitle('Passport Issue Date')
    .setRequired(true);
    
  form.addDateItem()
    .setTitle('Passport Expiration Date')
    .setRequired(true);
  
  // ===== SECTION 3: CONTACT INFO =====
  form.addPageBreakItem().setTitle('Contact Information');
  
  form.addTextItem()
    .setTitle('Current Street Address')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('City')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Postal Code')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Country')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Phone Number (with country code)')
    .setHelpText('Example: +49 123 456 7890')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Email Address')
    .setRequired(true);
    
  form.addMultipleChoiceItem()
    .setTitle('Do you have a German residence permit?')
    .setChoiceValues(['Yes', 'No'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Residence Permit Type')
    .setHelpText('e.g., Aufenthaltserlaubnis, Fiktionsbescheinigung');
    
  form.addDateItem()
    .setTitle('Residence Permit Expiration Date');
  
  // ===== SECTION 4: TRAVEL PLANS =====
  form.addPageBreakItem().setTitle('Travel Information');
  
  form.addMultipleChoiceItem()
    .setTitle('Purpose of Trip')
    .setChoiceValues(['Tourism', 'Visiting Friends/Family', 'Business', 'Medical Treatment', 'Other'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Approximate Arrival Date in US')
    .setHelpText('Example: March 2026 or specific date')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('How long do you plan to stay?')
    .setHelpText('Example: 2 weeks')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('US Address Where You Will Stay')
    .setHelpText('Full address of where you will be staying')
    .setRequired(true);
    
  form.addMultipleChoiceItem()
    .setTitle('Who is paying for the trip?')
    .setChoiceValues(['Self', 'Someone else', 'Shared'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('If someone else is paying, their name and relationship');
  
  // ===== SECTION 5: US CONTACT =====
  form.addPageBreakItem().setTitle('Contact Person in the US');
  
  form.addTextItem()
    .setTitle('Contact Name in US')
    .setHelpText('Person you are visiting')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Relationship to You')
    .setHelpText('e.g., Friend, Relative')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Contact\'s US Address')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Contact\'s Phone Number')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Contact\'s Email');
  
  // ===== SECTION 6: FAMILY =====
  form.addPageBreakItem().setTitle('Family Information');
  
  form.addTextItem()
    .setTitle('Father\'s Full Name')
    .setRequired(true);
    
  form.addDateItem()
    .setTitle('Father\'s Date of Birth')
    .setHelpText('Approximate if unknown');
    
  form.addMultipleChoiceItem()
    .setTitle('Is your father in the US?')
    .setChoiceValues(['No', 'Yes', 'Unknown']);
    
  form.addTextItem()
    .setTitle('Mother\'s Full Name')
    .setRequired(true);
    
  form.addDateItem()
    .setTitle('Mother\'s Date of Birth')
    .setHelpText('Approximate if unknown');
    
  form.addMultipleChoiceItem()
    .setTitle('Is your mother in the US?')
    .setChoiceValues(['No', 'Yes', 'Unknown']);
    
  form.addMultipleChoiceItem()
    .setTitle('Do you have any immediate relatives in the US?')
    .setHelpText('Spouse, children, siblings')
    .setChoiceValues(['No', 'Yes']);
    
  form.addTextItem()
    .setTitle('If yes, list their names and relationship');
  
  // ===== SECTION 7: WORK/EDUCATION =====
  form.addPageBreakItem().setTitle('Current Work or Education');
  
  form.addTextItem()
    .setTitle('Current Occupation/Status')
    .setHelpText('e.g., Software Engineer, Student, Unemployed')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Employer/School Name')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Employer/School Address')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Employer/School Phone');
    
  form.addDateItem()
    .setTitle('Start Date at Current Job/School');
    
  form.addTextItem()
    .setTitle('Monthly Income (EUR)')
    .setHelpText('Approximate, optional but helpful');
    
  form.addParagraphTextItem()
    .setTitle('Brief Description of Duties')
    .setHelpText('2-3 sentences about what you do');
  
  // ===== SECTION 8: EDUCATION =====
  form.addPageBreakItem().setTitle('Education Background');
  
  form.addMultipleChoiceItem()
    .setTitle('Highest Level of Education')
    .setChoiceValues(['No Formal Education', 'Primary School', 'High School', 'Vocational/Technical', 'Some University', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Name of Institution (Highest Degree)')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('City and Country of Institution');
    
  form.addTextItem()
    .setTitle('Field of Study/Major');
    
  form.addTextItem()
    .setTitle('Years Attended')
    .setHelpText('e.g., 2018-2022');
  
  // ===== SECTION 9: PREVIOUS US TRAVEL =====
  form.addPageBreakItem().setTitle('Previous US Travel & Visas');
  
  form.addMultipleChoiceItem()
    .setTitle('Have you ever been to the United States?')
    .setChoiceValues(['No', 'Yes'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('If yes, when and for how long?');
    
  form.addMultipleChoiceItem()
    .setTitle('Have you ever been issued a US visa?')
    .setChoiceValues(['No', 'Yes'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('If yes, what type and when?');
    
  form.addMultipleChoiceItem()
    .setTitle('Have you ever been REFUSED a US visa?')
    .setChoiceValues(['No', 'Yes'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('If refused, when and where?');
  
  // ===== SECTION 10: SECURITY QUESTIONS =====
  form.addPageBreakItem().setTitle('Security Questions')
    .setHelpText('These are required questions on the DS-160. Please answer honestly. Almost all should be NO.');
  
  var securityQuestions = [
    'Do you have a communicable disease of public health significance?',
    'Do you have a mental or physical disorder that poses a threat?',
    'Are you or have you been a drug abuser or addict?',
    'Have you ever been arrested or convicted of any offense or crime?',
    'Have you ever violated any law related to drugs?',
    'Have you ever been refused admission to the US or withdrawn your application?',
    'Have you ever been deported or removed from the US?',
    'Have you ever worked in the US without authorization?',
    'Have you ever been involved in espionage, sabotage, or terrorist activities?',
    'Have you ever been a member of a terrorist organization?',
    'Have you ever ordered, carried out, or participated in genocide, torture, or extrajudicial killings?',
    'Have you ever been involved in the recruitment of child soldiers?',
    'Have you ever served in or been a member of a paramilitary unit, police unit, self-defense unit, vigilante unit, rebel group, guerrilla group, or insurgent organization?'
  ];
  
  for (var i = 0; i < securityQuestions.length; i++) {
    form.addMultipleChoiceItem()
      .setTitle(securityQuestions[i])
      .setChoiceValues(['No', 'Yes'])
      .setRequired(true);
  }
  
  form.addParagraphTextItem()
    .setTitle('If you answered YES to any security question, please explain');
  
  // ===== SECTION 11: MILITARY =====
  form.addPageBreakItem().setTitle('Military Service');
  
  form.addMultipleChoiceItem()
    .setTitle('Have you ever served in the military?')
    .setChoiceValues(['No', 'Yes'])
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('If yes: Country, Branch, Rank, Dates');
    
  form.addMultipleChoiceItem()
    .setTitle('Do you have specialized skills in firearms, explosives, nuclear/biological/chemical experience?')
    .setChoiceValues(['No', 'Yes'])
    .setRequired(true);
  
  // ===== SECTION 12: PHOTO =====
  form.addPageBreakItem().setTitle('Photo Upload');
  
  form.addParagraphTextItem()
    .setTitle('Photo Requirements')
    .setHelpText('Requirements:\n- Recent (within 6 months)\n- White or off-white background\n- Full face, front view\n- No glasses\n- No head coverings (unless religious)\n- Size: 2x2 inches / 51x51mm\n\nYou can upload the photo here or send separately.');
    
  // Note: Google Forms doesn't support file uploads without some additional setup
  // They'll need to share the photo separately
  
  form.addTextItem()
    .setTitle('Link to Photo (Google Drive/Dropbox)')
    .setHelpText('Upload your photo to Google Drive or Dropbox and paste the shareable link here. Or indicate you will send separately.');
  
  // ===== FINAL =====
  form.addPageBreakItem().setTitle('Confirmation');
  
  form.addCheckboxItem()
    .setTitle('I confirm that:')
    .setChoiceValues([
      'All information provided is true and accurate',
      'I understand this information will be used to complete my DS-160 visa application',
      'I authorize Nikita/Clob to submit this application on my behalf'
    ])
    .setRequired(true);
  
  form.addParagraphTextItem()
    .setTitle('Any additional notes or questions?');
  
  // Set confirmation message
  form.setConfirmationMessage('Thank you! Your responses have been recorded. We will use this information to complete your DS-160 application. You will be contacted with next steps.');
  
  Logger.log('Form created: ' + form.getEditUrl());
  Logger.log('Form URL for respondents: ' + form.getPublishedUrl());
  
  return form;
}
