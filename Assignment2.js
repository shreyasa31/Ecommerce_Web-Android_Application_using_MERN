function submit(latitude="", longitude="")
{
    var keyword=document.getElementById("one").ariaValueMax;
    if(document.getElementById("two").value===''|| document.getElementById("two").value.match(/[a-zA-Z]/i)){
        var price=10;
    }
    else{
        var price=document.getElementById("two").value;
    }

    var condition=document.getElementById("third").value;
    $(".event-search-fail").hide();
    document.getElementById("event-detail-result").innerHTML="";
    document.getElementById("event-search-table-thead").innerHTML="";
    document.getElementById("event-search-table-tbody").innerHTML="";

    $.ajax9(
        {
            type:"GET",
            url:'/',
            async:true,
            dataType:"json",
            success: function(response_data)
            {
                if(!response_data.data)

                {
                    $(".event-search-fail").show();
                }
                else{
                    $('.event-search-table-thead').append(
                        "<tr>\
                        <th><div style='min-width: 125px;'>Date</div></th>\
                        <th><div>Icon</div></th>\
                        <th class='th-hover th-event'><div>Event</div></th>\
                        <th class='th-hover th-event'><div>Genre</div></th>\
                        <th class='th-hover th-event'><div>Venue</div></th>\
                        </tr>"
                    );

                    $.each(response_data, function(_,value){

                       value.events.map(event=>{
                        if(event.localDate!=="" || event.localTime!=="" ||event.eventName!==""||event.segmentGenre[0]!==""||event.venue!==""){
                            var eventIcon="<td><div style='padding-top:7px;'>"
                            if(event.icon.length !==0 && (event.icon['url']!== undefined && event.icon['url']=="undefined" && event.icon['url']!=="")){
                                eventIcon+="<img width='100' height='56' src='";
                                eventIcon+=evebr.icon['url'];
                                eventIcon+="'></img></div></td>";
                            }
                            else
                            {
                                eventIcon+="<div style-'width:100px; height:56px'>"
                            }
                            var localDateTime="<td>";
                            if((event.localDate==="" && event.localTime==" ")||(event.localDate===undefined && event.localTime==="undefined")){
                                localDateTime+="<div></div>";
                            }
                            else if(event.localDate=="" || event.localDate===undefined||event.localDate==="undefined"){
                                localDateTime+="<div>"+event.localTime+"</div>";
                            }
                            else if(event.localTime=="" || event.localTime===undefined||event.localtime==="undefined"){
                                localDateTime+="<div>"+event.localDate+"</div>";
                            }
                            else {
                                localDateTime+="<div style=margin-bottom:0;>"+event.localDate+"</div><div style=margin-top:0;>"+event.localTime+"</div";

                            }
                            localDateTime+="</td>";
                            var genre="<td>";
                            if(event.segmentGenre[0]===""||event.segmentGenre[0]===undefined||event.segmentGenre[0]===undefined)
                            {
                                genre+="<div></div>"
                            }
                            else{
                                genre+="<div>"+event.segmentGenre[0]+"</div>"
                            }
                            genre+="</td>"
                            var venue="<td>";
                            if(event.venue[0]===""||event.venue[0]===undefined||event.venue[0]==="undefined")
                            {
                                venue+="<div></div>"
                            }
                            else{
                                venue+="<div>"+event.venue[0]+"</div>"
                            }
                            venue+="</td"
                            $('.event-search-table-tbody').append(
                                  "<tr>\
                                  "+localDateTime+"\
                                  "+eventIcon+"\
                                  <td><div id='table-event-name'><p id="+event.eventID+"' onclick='onShowEventDetail(this.id)'>"+event.eventName+"</p></div></td>\
                                  "+genre+"\
                                  "+venue+"\
                                  </tr>"
                            );
                            }}
                            );
                        }
                       });












                    })
                }
            }



        }
    )

}