**ModBuddy API**
----

* **URL**

  _/train_

* **Method:**
  
  <_The request type_>

  `GET` | `POST`

    _A get request will return a demonstration web page with a testing form._
  
*  **URL Parameters**

   **Required:**
  `harassing-comments=[string]`
    This parameter represents a CRLF or LF delimited list of strings. These strings are interpreted as harassing comments and will be used to train the Custom Collections API
  `non-harassing-comments=[string]`
    This parameter represents a CRLF or LF delimited list of strings. These strings are interpreted as harassing comments and will be used to train the Custom Collections API

* **Success Response:**

  * **Code:** 200
    **Content:** 
    * Web page indicating success of training

* **Error Response:**

  * **Code:** 400
    **Content:** 
    * Occurs when any of the required parameters are missing
 
