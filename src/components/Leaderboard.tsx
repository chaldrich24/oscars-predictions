import { use, useEffect, useState } from "react";
import { getCategories, submitEntry } from "../lib/supabaseClient";

function Leaderboard() {
    return (
  <div style={{ width: "90%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 50 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexDirection: "column" }}>
      <h2 style={{ margin: 0, fontFamily: "Cormorant Garamond, serif", color: "white" }}>Leaderboard</h2>
      <div style={{ fontSize: 12, opacity: 0.7, color: "white" }}>Points update when winners are set</div>
    </div>
    {/* Start of map */}
    <div style={{width: "90%", maxWidth: 500, margin: "0 auto", background: "rgba(255,255,255,0.1)", padding: 16, borderRadius: 12}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, width: "100%"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", flex: 3, textAlign: "center", flexDirection: "row"}}>
                <p style={{...styles.title,  textAlign: "left", textWrap: "wrap"}}>Name</p>
                <p style={{...styles.title, flex: 1, textAlign: "right", textWrap: "wrap"}}>Best Picture</p>  
            </div>
            <div style={{flex: 1, textAlign: "right"}}>                   
                <p style={{...styles.title, textAlign: "right"}}>Score</p>
            </div>
        </div>   
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, width: "100%"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", flex: 3, textAlign: "center", flexDirection: "row"}}>
                <p style={{ textAlign: "left", textWrap: "wrap"}}>Chad</p>
                <div>
                    <img src={"/images/obaa.jpg"} style={{width: 70, height: 100, marginRight: 9}} />
                </div>    
            </div>
            <div style={{flex: 1, textAlign: "right"}}>                   
                <p style={{textAlign: "right"}}>12</p>
            </div>
        </div> 
    </div>
</div>
);
};

const styles = {
    title: {
        marginTop: 0
    }   
}

export default Leaderboard;