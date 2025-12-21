//user logout route
module.exports.userLogout = (req, res) => {
  try {
    res.clearCookie("user_token");
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private, max-age=0"
    );
    res.redirect("/"); // redirect after headers are set
  } catch (err) {
    res.send(err.message);
  }
};

//owner logout route
module.exports.ownerLogout = (req, res) => {
  try {
    res.clearCookie("admin_token");
    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private, max-age=0"
    );
    res.redirect("/owners/ownerLogin");
  } catch (err) {
    console.log("from owner logout", err.message);
  }
};
