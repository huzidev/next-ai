const headers = {
  "Content-Type": "application/json",
};

export async function postRequest(url: string, body: object) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (error) {
    console.error("Error in postRequest:", error);
    return null;
  }
}

export async function getRequest(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    return await response.json();
  } catch (error) {
    console.error("Error in getRequest:", error);
    return null;
  }
}
