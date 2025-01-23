/**
 * 
 useEffect(() => {
     if (summary.custom_prompt_details) {
       if (summary.custom_prompt_details.summary_translated?.summary_as_md) {
         setCompletion(
           summary.custom_prompt_details.summary_translated.summary_as_md
         );
       } else {
         setCompletion(summary.custom_prompt_details.summary_as_md);
       }
     } else if (
       summary.summary_translations &&
       summary.summary_translations.length > 0
     ) {
       setCompletion(summary.summary_translations[0].summary_as_md);
     } else if (!summary.summary && summary.captions) {
       complete(summary.captions);
     } else if (
       summary.captions &&
       promptType &&
       !summary.custom_prompt_response
     ) {
       complete(summary.captions);
     } else if (!summary.custom_prompt_response_as_html) {
       setCompletion(
         summary.summary_as_md || summary.summary_html || summary.summary
       );
     } else if (summary.custom_prompt_response_as_html) {
       setCompletion(summary.custom_prompt_response_as_html);
     } else if (!summary.captions) {
       setErrMsg("Transcript not found");
     }
   }, []);
 */
