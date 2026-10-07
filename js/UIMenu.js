/*
 * This file is part of the Education Network Simulator project and covered 
 * by GPLv3 license. See full terms in the LICENSE file at the root folder
 * or at http://www.gnu.org/licenses/gpl-3.0.html.
 * 
 * (c) 2015 Jorge García Ochoa de Aspuru
 * bardok@gmail.com
 * 
 * Images are copyrighted by their respective authors and have been 
 * downloaded from http://pixabay.com/
 * 
 */

var UIMenu = function(description, X,Y, fixed)
{
    var X = X;
    var Y = Y;
    var entries = [];
    var id = "uimenu_" + getNextID();
    var description = description;
    var visible = false;
    var fixed = fixed;
    var _self = this;

    function init()
    {
        uitranslation.addObserver(_self);
    }
    
    this.dispose = function()
    {
        uitranslation.deleteObserver(this);
    };

    this.localeChanged = function()
    {
        /*for (var i = 0; i < entries.length; i++)
        {
            var span = document.getElementById(entries[i].id);
            span.innerHTML = _(entries[i].text);
        }*/
    };

    this.getId = function()
    {
        return id;
    };

    this.getVisible = function()
    {
        return visible;
    };

    this.isFixed = function()
    {
        return fixed;
    };

    this.hideAfterAction = function()
    {
        if (visible)
        {
            this.hide();
        }
    };

    this.addEntry = function(img, text, js)
    {
        var data = {};
        data.id = "entry_" + getNextID();
        data.img = img;
        data.text = text;
        data.js = js;
        entries.push(data);
    };

    this.setPos = function(cX, cY)
    {
        X = cX;
        Y = cY;
    };

    // Position a menu using canvas coordinates. Menus are DOM elements, while
    // network objects are drawn in the canvas coordinate system; convert
    // between the two so the menu stays beside the selected object even when
    // the canvas is scaled, offset or the page is scrolled.
    this.setCanvasPos = function(cX, cY)
    {
        var canvas = document.getElementById("simcanvas");
        var bbox = canvas.getBoundingClientRect();
        X = window.pageXOffset + bbox.left + cX * (bbox.width / canvas.width);
        Y = window.pageYOffset + bbox.top + cY * (bbox.height / canvas.height);
    };

    this.setDescription = function(desc)
    {
        description = desc;
    };

    this.purge = function()
    {
        entries = [];
    }

    this.show = function()
    {
        // Avoid duplicate menu nodes if show() is called twice.
        var oldDiv = document.getElementById(id);
        if (oldDiv && oldDiv.parentNode)
        {
            oldDiv.parentNode.removeChild(oldDiv);
        }

        var div = document.createElement("div");
        div.setAttribute("id", id);
        div.className = "ns-menu" + (fixed ? " ns-menu-fixed" : "");
        div.style.position = fixed ? "fixed" : "absolute";
        div.style.visibility = "hidden";
        div.style.zIndex = "1000";

        var title = document.createElement("div");
        title.className = "ns-menu-title";
        title.textContent = _(description);
        div.appendChild(title);

        var items = document.createElement("div");
        items.className = "ns-menu-items";

        for (var i = 0; i < entries.length; i++)
        {
            var link = document.createElement("a");
            link.href = "#";
            link.className = "ns-menu-item";
            if (entries[i].js.indexOf("createLinkAction()") !== -1)
            {
                link.setAttribute("onclick", entries[i].js + "uimanager.closeContextMenus();return false;");
            }
            else
            {
                link.setAttribute("onclick", entries[i].js + "uimanager.closeContextMenus();uimanager.menuOptionClicked();return false;");
            }

            var img = document.createElement("img");
            img.src = entries[i].img;
            img.alt = "";
            link.appendChild(img);

            var span = document.createElement("span");
            span.id = entries[i].id;
            span.textContent = _(entries[i].text);
            link.appendChild(span);
            items.appendChild(link);
        }

        div.appendChild(items);
        document.body.appendChild(div);

        // Keep contextual menus close to the selected object, but never let
        // them disappear beyond the visible browser window.
        var gap = 10;
        var menuWidth = div.offsetWidth;
        var menuHeight = div.offsetHeight;
        var scrollX = fixed ? 0 : window.pageXOffset;
        var scrollY = fixed ? 0 : window.pageYOffset;
        var minX = scrollX + gap;
        var minY = scrollY + gap;
        var maxX = scrollX + document.documentElement.clientWidth - menuWidth - gap;
        var maxY = scrollY + document.documentElement.clientHeight - menuHeight - gap;
        var left = Math.max(minX, Math.min(X, maxX));
        var top = Math.max(minY, Math.min(Y, maxY));

        div.style.left = left + "px";
        div.style.top = top + "px";
        div.style.visibility = "visible";
        visible = true;
    };

    this.hide = function()
    {
        var div = document.getElementById(id);
        if (div && div.parentNode)
        {
            div.parentNode.removeChild(div);
        }
        visible = false;
    };

    init();
};