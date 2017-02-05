**ModBuddy API**
----

* **URL**

  _/analyze_

* **Method:**
  
  <_The request type_>

  `GET` | `POST`

    _A get request will return a demonstration web page with a testing form._
  
*  **URL Parameters**

   **Required:**
  `comment-text=[string]`
    This parameter represents a comment, or a JSON array of comments to analyze. If an array is to be analyzed, you must specify the `request-type` parameter
   **Optional:**
  `request-type={web|array}`
  `request-type=web` causes the API to return the testing web page with the raw request results for testing and demonstration purposes
  `request-type=array` causes the API to interpret `comment-text` as a JSON array of comments.

* **Success Response:**

  * **Code:** 200
    **Content:** 
    * If a single comment was supplied as comment-text, the response will be a JSON object representing the analysis from the indico API. 
    * If `request-type=array` is specified, an array of JSON objects will be returned that represent the respective analysis of each comment
    * If `request-type=web` was specified, an HTML page with results will be returned
 